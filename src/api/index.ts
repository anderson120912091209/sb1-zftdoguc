import { supabase } from '../lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];
type UserGoal = Database['public']['Enums']['user_goals'];
type SkillLevel = Database['public']['Enums']['skill_levels'];

// Types for frontend use
export interface ProfileWithSkills extends Profile {
  skills: Skill[];
}

export interface ProfileFormData {
  display_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  skill_level: Database['public']['Enums']['skill_levels'];
  goal: Database['public']['Enums']['user_goals'];
  background_text: string;
  is_public: boolean;
  skills: string[];
}

/**
 * API namespace with methods organized by resource
 */
const API = {
  /**
   * Skills related API methods
   */
  skills: {
    /**
     * Get all available skills from the database
     */
    async getAllSkills(): Promise<Database['public']['Tables']['skills']['Row'][]> {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching skills:', error);
        return [];
      }
    },
    
    /**
     * Add a new skill if it doesn't exist
     */
    async addSkill(name: string): Promise<Skill | null> {
      try {
        const { data, error } = await supabase
          .from('skills')
          .insert([{ name }])
          .select()
          .single();
          
        if (error) {
          // If the skill already exists, try to fetch it
          if (error.code === '23505') { // Unique violation
            const { data: existingSkill } = await supabase
              .from('skills')
              .select('*')
              .eq('name', name)
              .single();
            
            return existingSkill;
          }
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error adding skill:', error);
        return null;
      }
    }
  },
  
  /**
   * Profile related API methods
   */
  profiles: {
    /**
     * Upload avatar for a user
     */
    async uploadAvatar(userId: string, file: File) {
      try {
        // Generate a unique file path
        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        return { data, error: null };
      } catch (error) {
        console.error('Error uploading avatar:', error);
        return { data: null, error };
      }
    },
    
    /**
     * Create or update a user profile
     */
    async upsertProfile(user: User, profileData: ProfileFormData) {
      try {
        // Prepare the profile data for the profiles table
        const profile = {
          user_id: user.id,
          display_name: profileData.display_name,
          email: profileData.email || user.email,
          avatar_url: profileData.avatar_url,
          bio: profileData.bio,
          skill_level: profileData.skill_level,
          goal: profileData.goal,
          background_text: profileData.background_text,
          is_public: profileData.is_public,
        };
        
        // First, upsert the profile
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .upsert(profile)
          .select('id')
          .single();
          
        if (profileError) throw profileError;
        
        const profileId = profileResult.id;
        
        // Next, delete existing skills relationships
        const { error: deleteError } = await supabase
          .from('profiles_skills')
          .delete()
          .eq('profile_id', profileId);
          
        if (deleteError) throw deleteError;
        
        // If we have skills, insert the new relationships
        if (profileData.skills.length > 0) {
          // First, get the skill IDs for the skill names
          const { data: skillsData, error: skillsError } = await supabase
            .from('skills')
            .select('id, name')
            .in('name', profileData.skills);
            
          if (skillsError) throw skillsError;
          
          const skillMap = new Map();
          skillsData?.forEach(skill => {
            skillMap.set(skill.name, skill.id);
          });
          
          // Now create the profile_skills relationships
          const skillsToInsert = profileData.skills
            .filter(skillName => skillMap.has(skillName))
            .map(skillName => ({
              profile_id: profileId,
              skill_id: skillMap.get(skillName)
            }));
            
          if (skillsToInsert.length > 0) {
            const { error: insertError } = await supabase
              .from('profiles_skills')
              .insert(skillsToInsert);
              
            if (insertError) throw insertError;
          }
        }
        
        return { success: true, error: null };
      } catch (error: any) {
        console.error('Error upserting profile:', error);
        return { success: false, error: error.message || 'Failed to save profile' };
      }
    },
    
    /**
     * Get profile by user ID
     */
    async getProfileByUserId(userId: string) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            *,
            skills:profiles_skills(
              skill:skills(id, name)
            )
          `)
          .eq('user_id', userId)
          .single();
          
        if (error) throw error;
        
        // Transform the nested skills data for easier use
        if (profile) {
          profile.skills = profile.skills.map((item: any) => item.skill);
        }
        
        return { profile, error: null };
      } catch (error) {
        console.error('Error fetching profile:', error);
        return { profile: null, error };
      }
    }
  },
  
  /**
   * Teams related API methods
   */
  teams: {
    /**
     * Get all public profiles with their skills
     */
    async getPublicProfiles(filters: { 
      skills?: string[], 
      skillLevel?: Database['public']['Enums']['skill_levels'], 
      goal?: Database['public']['Enums']['user_goals'],
      searchTerm?: string
    } = {}): Promise<{ profiles: ProfileWithSkills[], error: any }> {
      try {
        let query = supabase
          .from('profiles')
          .select(`
            *,
            skills:profiles_skills(
              skill:skills(id, name)
            )
          `)
          .eq('is_public', true);
          
        // Apply filters if provided
        if (filters.skillLevel) {
          query = query.eq('skill_level', filters.skillLevel);
        }
        
        if (filters.goal) {
          query = query.eq('goal', filters.goal);
        }
        
        if (filters.searchTerm) {
          query = query.or(`display_name.ilike.%${filters.searchTerm}%,bio.ilike.%${filters.searchTerm}%`);
        }
        
        const { data: profiles, error } = await query;
          
        if (error) throw error;
        
        // Transform the nested skills data for easier use
        let transformedProfiles = profiles.map(profile => ({
          ...profile,
          skills: profile.skills.map((item: any) => item.skill)
        }));
        
        // Filter by skills if provided
        if (filters.skills && filters.skills.length > 0) {
          transformedProfiles = transformedProfiles.filter(profile => {
            const profileSkillNames = profile.skills.map((skill: any) => skill.name);
            return filters.skills!.some(skillName => profileSkillNames.includes(skillName));
          });
        }
        
        return { profiles: transformedProfiles, error: null };
      } catch (error) {
        console.error('Error fetching public profiles:', error);
        return { profiles: [], error };
      }
    }
  }
};

export default API; 