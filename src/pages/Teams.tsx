import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, MapPin } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import { useAuth } from '../context/auth';
import API, { ProfileWithSkills } from '../api';
import type { Database } from '../types/supabase';

type UserGoal = Database['public']['Enums']['user_goals'];
type SkillLevel = Database['public']['Enums']['skill_levels'];

const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithSkills[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithSkills[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState<UserGoal | ''>('');
  const [skillLevelFilter, setSkillLevelFilter] = useState<SkillLevel | ''>('');
  const [activeProfiles, setActiveProfiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sentMatchRequests, setSentMatchRequests] = useState<Set<string>>(new Set());

  // Load profiles using the API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the API to fetch public profiles
        const { profiles, error } = await API.teams.getPublicProfiles({
          goal: goalFilter || undefined,
          skillLevel: skillLevelFilter || undefined,
          skills: skillFilter ? [skillFilter] : undefined
        });
        
        if (error) throw error;
        
        setProfiles(profiles);
        setFilteredProfiles(profiles);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [goalFilter, skillLevelFilter]); // These filters trigger a server-side refetch

  // Apply client-side filters
  useEffect(() => {
    let result = [...profiles];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(profile => 
        profile.display_name?.toLowerCase().includes(query) || 
        profile.bio?.toLowerCase().includes(query) ||
        profile.skills.some(skill => skill.name.toLowerCase().includes(query))
      );
    }

    // Apply skill filter (if not already filtered on server)
    if (skillFilter && goalFilter === '' && skillLevelFilter === '') {
      result = result.filter(profile => 
        profile.skills.some(skill => skill.name.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    setFilteredProfiles(result);
  }, [profiles, searchQuery, skillFilter, goalFilter, skillLevelFilter]);

  // Toggle card expand
  const toggleCardExpand = (profileId: string) => {
    setActiveProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  // Send match request
  const sendMatchRequest = async (profileId: string) => {
    try {
      setError(null);
      
      if (!user) {
        setError('You must be logged in to send match requests');
        return;
      }
      
      // Mock match request for now
      // In a real app, this would call API.teams.sendMatchRequest or similar
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update UI
      setSentMatchRequests(prev => new Set(prev).add(profileId));
    } catch (err: any) {
      console.error('Error sending match request:', err);
      setError(err.message || 'Failed to send match request');
    }
  };

  // Helper function to get initials from display name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format goal labels for display
  const formatGoalLabel = (goal: UserGoal): string => {
    switch (goal) {
      case 'exploring': return 'Exploring';
      case 'early_ideation': return 'Early Ideation';
      case 'serious_startup': return 'Serious Startup';
      default: return goal;
    }
  };

  return (
    <div className="container-custom py-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Teams</h1>
          <p className="text-lg mb-8">Connect with talented people and form your dream team</p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 z-30 bg-deep-space/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, or bio..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by skill"
                  className="pl-10 w-full md:w-32 lg:w-40"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="pl-10 w-full md:w-40 h-10 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm"
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value as UserGoal | '')}
                >
                  <option value="">All Goals</option>
                  <option value="exploring">Exploring</option>
                  <option value="early_ideation">Early Ideation</option>
                  <option value="serious_startup">Serious Startup</option>
                </select>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select
                  className="pl-10 w-full md:w-40 h-10 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-cosmic-purple sm:text-sm"
                  value={skillLevelFilter}
                  onChange={(e) => setSkillLevelFilter(e.target.value as SkillLevel | '')}
                >
                  <option value="">All Skill Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cosmic-purple"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500 text-center">
            <p className="text-red-400">{error}</p>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProfiles.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-stellar-blue mb-2">No Profiles Found</h3>
            <p className="text-star-white/60 mb-4">Try adjusting your filters</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSkillFilter('');
                setGoalFilter('');
                setSkillLevelFilter('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card 
                key={profile.id} 
                className={`border border-white/10 bg-gradient-to-br from-deep-space to-deep-space/70 overflow-hidden transition-all duration-300 ${
                  activeProfiles.has(profile.id) ? 'shadow-glow' : 'hover:shadow-glow-sm hover:border-cosmic-purple/50'
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-cosmic-purple/50">
                        <AvatarImage src={profile.avatar_url || ''} alt={profile.display_name || 'User'} />
                        <AvatarFallback className="bg-cosmic-purple/30 text-white">
                          {getInitials(profile.display_name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{profile.display_name}</h3>
                        <div className="flex items-center text-sm text-star-white/60">
                          <Badge variant="outline" className="text-xs mr-2">
                            {profile.skill_level?.charAt(0).toUpperCase() + profile.skill_level?.slice(1)}
                          </Badge>
                          {profile.goal && (
                            <span className="text-xs">
                              {formatGoalLabel(profile.goal)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent onClick={() => toggleCardExpand(profile.id)} className="cursor-pointer py-2">
                  {/* Skills */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.slice(0, 5).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-cosmic-purple/20 text-stellar-blue">
                          {skill.name}
                        </Badge>
                      ))}
                      {profile.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{profile.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Bio preview - only shown if expanded or no skills */}
                  {(activeProfiles.has(profile.id) || profile.skills.length === 0) && profile.bio && (
                    <div className="mt-2 animate-fadeIn text-sm text-star-white/80 line-clamp-3">
                      {profile.bio}
                    </div>
                  )}

                  {/* Full content - only shown if expanded */}
                  {activeProfiles.has(profile.id) && (
                    <div className="mt-4 space-y-3 animate-fadeIn">
                      {/* Full Skills List */}
                      {profile.skills.length > 5 && (
                        <div className="mt-2">
                          <p className="text-xs text-star-white/60 mb-1">All Skills</p>
                          <div className="flex flex-wrap gap-1.5">
                            {profile.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-cosmic-purple/20 text-stellar-blue">
                                {skill.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Background */}
                      {profile.background_text && (
                        <div>
                          <p className="text-xs text-star-white/60 mb-1">Background</p>
                          <p className="text-sm text-star-white/80">{profile.background_text}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={sentMatchRequests.has(profile.id) ? "secondary" : "default"} 
                          className={sentMatchRequests.has(profile.id) ? "bg-cosmic-purple/20 text-cosmic-purple" : ""}
                          disabled={sentMatchRequests.has(profile.id) || !user}
                          onClick={() => sendMatchRequest(profile.id)}
                        >
                          {sentMatchRequests.has(profile.id) ? "Request Sent" : "Match Request"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {!user ? (
                          <p>Please sign in to send match requests</p>
                        ) : (
                          <p>
                            {sentMatchRequests.has(profile.id) 
                              ? "You've already sent a match request" 
                              : "Send a match request to connect"}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage; 