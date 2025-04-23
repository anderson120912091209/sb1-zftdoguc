import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { supabase } from '../lib/supabaseClient';

const SetupProfile: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150');
  const [timezone, setTimezone] = useState('UTC+0');
  const [availableHours, setAvailableHours] = useState('');
  
  // Skills and interests
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  // Remove a skill
  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  // Add a new interest
  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };
  
  // Remove an interest
  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || skills.length === 0) {
      alert('Please provide your name and at least one skill');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be a Supabase call to create/update profile
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .upsert({
      //     name,
      //     bio,
      //     avatar_url: avatarUrl,
      //     timezone,
      //     available_hours: availableHours,
      //     skills,
      //     interests,
      //     updated_at: new Date(),
      //   });
      
      // if (error) throw error;
      
      // Mock a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to teams page
      navigate('/teams');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Setup Your Profile</h1>
          <p className="text-lg">Complete your profile to connect with potential teammates</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself, your experience, and what you're looking for in a team"
                    className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium mb-1">
                    Timezone
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      placeholder="e.g. UTC+8"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="availableHours" className="block text-sm font-medium mb-1">
                    Available Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="availableHours"
                      value={availableHours}
                      onChange={(e) => setAvailableHours(e.target.value)}
                      placeholder="e.g. Evenings, Weekends"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Skills
                  </label>
                  <div className="flex">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="skill" className="group">
                        {skill}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-red-500/20 p-0.5"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Interests
                  </label>
                  <div className="flex">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add an interest"
                      className="mr-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInterest();
                        }
                      }}
                    />
                    <Button type="button" onClick={addInterest} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interests.map((interest) => (
                      <Badge key={interest} variant="interest" className="group">
                        {interest}
                        <button
                          type="button"
                          className="ml-1 rounded-full hover:bg-red-500/20 p-0.5"
                          onClick={() => removeInterest(interest)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Profile Preview */}
          <div className="md:col-span-1">
            <div className="sticky top-28">
              <h3 className="text-lg font-medium mb-4">Profile Preview</h3>
              <Card className="overflow-hidden bg-gradient-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                      <Avatar className="h-12 w-12 border-2 border-stellar-blue">
                        <AvatarImage src={avatarUrl} alt={name || 'Preview'} />
                        <AvatarFallback>{name ? name.substring(0, 2) : 'P'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{name || 'Your Name'}</CardTitle>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{timezone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {skills.map((skill) => (
                            <Badge key={skill} variant="skill">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-3 rounded-md bg-slate-800/50 text-sm text-slate-400 mt-3">
                          Add skills to see them here
                        </div>
                      )}
                      
                      {interests.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {interests.map((interest) => (
                            <Badge key={interest} variant="interest">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      {availableHours && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-stellar-blue" />
                          <span>{availableHours}</span>
                        </div>
                      )}
                      
                      {bio && <p className="mt-3 text-sm">{bio}</p>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled>
                    Your Profile
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProfile;

 