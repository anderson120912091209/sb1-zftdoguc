import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRequireAuth } from '../context/auth';
import API, { ProfileFormData } from '../api';
import type { Database } from '../types/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Progress } from '../components/ui/progress';
import { X, Upload, Check, ChevronRight, ChevronLeft, RefreshCw, Rocket, Book, Sparkles } from 'lucide-react';

type UserGoal = Database['public']['Enums']['user_goals'];
type SkillLevel = Database['public']['Enums']['skill_levels'];
type Skill = Database['public']['Tables']['skills']['Row'];

const STEPS = [
  { 
    id: 'basics',
    title: 'Basic Info', 
    description: 'Let others know who you are' 
  },
  { 
    id: 'skills',
    title: 'Skills & Expertise', 
    description: 'Share your technical skills' 
  },
  { 
    id: 'goals',
    title: 'Goals & Background', 
    description: 'What are you looking to achieve?' 
  },
  { 
    id: 'privacy',
    title: 'Privacy Settings', 
    description: 'Control who sees your profile' 
  }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useRequireAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formComplete, setFormComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    display_name: '',
    email: '',
    avatar_url: '',
    bio: '',
    skill_level: 'beginner',
    goal: 'exploring',
    background_text: '',
    is_public: false,
    skills: []
  });
  
  // Initialize form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        email: profile.email || user?.email || '',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        skill_level: profile.skill_level || 'beginner',
        goal: profile.goal || 'exploring',
        background_text: profile.background_text || '',
        is_public: profile.is_public || false,
        skills: profile.skills ? profile.skills.map(s => s.name) : []
      });
      
      if (profile.avatar_url) {
        setPreviewUrl(profile.avatar_url);
      }
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        display_name: user.email?.split('@')[0] || '',
        email: user.email || ''
      }));
    }
    
    // Fetch available skills
    fetchSkills();
  }, [profile, user]);
  
  // Check if form is complete enough to proceed
  useEffect(() => {
    // Basic validation - at minimum we need display name, email, and 1+ skills
    setFormComplete(
      formData.display_name.trim() !== '' && 
      formData.email.trim() !== '' && 
      formData.skills.length > 0
    );
  }, [formData]);
  
  async function fetchSkills() {
    setLoading(true);
    try {
      const skills = await API.skills.getAllSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_public: checked }));
  };
  
  const handleSkillToggle = (skillName: string) => {
    setFormData(prev => {
      const skills = [...prev.skills];
      
      if (skills.includes(skillName)) {
        return { ...prev, skills: skills.filter(s => s !== skillName) };
      } else {
        return { ...prev, skills: [...skills, skillName] };
      }
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if a new one was selected
      let finalAvatarUrl = formData.avatar_url;
      if (avatarFile) {
        const { data, error } = await API.profiles.uploadAvatar(user.id, avatarFile);
        
        if (error) throw error;
        if (data) {
          finalAvatarUrl = data.publicUrl;
        }
      }
      
      // Prepare the profile data
      const profileData: ProfileFormData = {
        ...formData,
        avatar_url: finalAvatarUrl
      };
      
      // Save profile
      const { success, error } = await API.profiles.upsertProfile(user, profileData);
      
      if (!success) {
        throw new Error(error || 'Failed to save profile');
      }
      
      // Refresh the profile in context
      await refreshProfile();
      
      toast.success('Profile saved successfully!');
      
      // Redirect to teams page
      navigate('/teams');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Helper function to get goal description
  const getGoalDescription = (goal: UserGoal) => {
    switch (goal) {
      case 'exploring':
        return 'Just exploring opportunities and learning';
      case 'early_ideation':
        return 'Working on early ideas, looking for feedback';
      case 'serious_startup':
        return 'Building a serious startup, looking for co-founders';
      default:
        return '';
    }
  };
  
  // Helper function to get level description
  const getLevelDescription = (level: SkillLevel) => {
    switch (level) {
      case 'beginner':
        return 'Just starting out, basic knowledge';
      case 'intermediate':
        return 'Comfortable with core concepts';
      case 'advanced':
        return 'Significant experience, can tackle complex problems';
      case 'expert':
        return 'Deep expertise, can teach others';
      default:
        return '';
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-cosmic-purple/50">
                <AvatarImage src={previewUrl || ''} alt={formData.display_name} />
                <AvatarFallback className="bg-cosmic-purple/30 text-white text-4xl">
                  {getInitials(formData.display_name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={() => document.getElementById('avatar')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                {previewUrl && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setPreviewUrl(null);
                      setAvatarFile(null);
                      setFormData(prev => ({ ...prev, avatar_url: '' }));
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-star-white/60">
                Recommended: Square image, 500x500px or larger
              </p>
            </div>
            
            {/* Display Name */}
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Your display name"
                className="mt-1"
                required
              />
            </div>
            
            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your email"
                className="mt-1"
                required
              />
            </div>
            
            {/* Bio */}
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ''}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself..."
                className="mt-1 min-h-24"
              />
              <p className="text-xs text-star-white/60 mt-1">
                This will be visible to others on your profile
              </p>
            </div>
          </div>
        );
      
      case 1: // Skills
        return (
          <div className="space-y-6">
            {/* Skill Level */}
            <div>
              <Label htmlFor="skill_level">Your Overall Skill Level</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {(['beginner', 'intermediate', 'advanced', 'expert'] as SkillLevel[]).map((level) => (
                  <div 
                    key={level}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.skill_level === level 
                        ? 'border-cosmic-purple bg-cosmic-purple/10' 
                        : 'border-white/10 hover:border-cosmic-purple/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, skill_level: level }))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{level}</span>
                      {formData.skill_level === level && (
                        <div className="bg-cosmic-purple h-5 w-5 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-star-white/70">{getLevelDescription(level)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills Selection */}
            <div>
              <Label>Technical Skills</Label>
              <p className="text-sm text-star-white/70 mb-3">
                Select skills that best represent your technical expertise
              </p>
              
              <div className="space-y-4">
                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 min-h-12 p-3 border border-white/10 rounded-lg">
                  {formData.skills.length > 0 ? (
                    formData.skills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="secondary"
                        className="bg-cosmic-purple/20 text-stellar-blue flex items-center px-3 py-1.5"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => handleSkillToggle(skill)}
                          className="ml-1 rounded-full h-4 w-4 flex items-center justify-center hover:bg-cosmic-purple/30"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <div className="text-sm text-star-white/60 flex items-center justify-center w-full h-8">
                      No skills selected yet
                    </div>
                  )}
                </div>
                
                {/* Available Skills */}
                <div>
                  <Label className="text-sm">Popular Skills</Label>
                  <div className="mt-2 flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 border border-white/10 rounded-lg">
                    {loading ? (
                      <div className="flex items-center text-sm text-star-white/60 w-full justify-center py-4">
                        <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                        Loading skills...
                      </div>
                    ) : (
                      availableSkills.map(skill => (
                        <Badge
                          key={skill.id}
                          variant={formData.skills.includes(skill.name) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            formData.skills.includes(skill.name) 
                              ? "bg-cosmic-purple hover:bg-cosmic-purple/80" 
                              : "hover:bg-cosmic-purple/20"
                          }`}
                          onClick={() => handleSkillToggle(skill.name)}
                        >
                          {skill.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2: // Goals & Background
        return (
          <div className="space-y-6">
            {/* Goal */}
            <div>
              <Label htmlFor="goal">Your Primary Goal</Label>
              <div className="grid grid-cols-1 gap-4 mt-2">
                {(['exploring', 'early_ideation', 'serious_startup'] as UserGoal[]).map((goal) => (
                  <div 
                    key={goal}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.goal === goal 
                        ? 'border-cosmic-purple bg-cosmic-purple/10' 
                        : 'border-white/10 hover:border-cosmic-purple/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, goal: goal }))}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        {goal === 'exploring' && <Book className="h-5 w-5 mr-2 text-stellar-blue" />}
                        {goal === 'early_ideation' && <Sparkles className="h-5 w-5 mr-2 text-stellar-blue" />}
                        {goal === 'serious_startup' && <Rocket className="h-5 w-5 mr-2 text-stellar-blue" />}
                        <span className="font-medium">
                          {goal === 'exploring' && 'Exploring'}
                          {goal === 'early_ideation' && 'Early Ideation'}
                          {goal === 'serious_startup' && 'Serious Startup'}
                        </span>
                      </div>
                      {formData.goal === goal && (
                        <div className="bg-cosmic-purple h-5 w-5 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-star-white/70 ml-7">{getGoalDescription(goal)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Background */}
            <div>
              <Label htmlFor="background_text">Professional Background</Label>
              <Textarea
                id="background_text"
                name="background_text"
                value={formData.background_text || ''}
                onChange={handleInputChange}
                placeholder="Share your professional background, experience, education..."
                className="mt-1 min-h-32"
              />
              <p className="text-xs text-star-white/60 mt-1">
                Optional: Add details about your previous projects, education, or work experience
              </p>
            </div>
          </div>
        );
      
      case 3: // Privacy
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Almost there!</h3>
              <p className="text-star-white/70">
                Choose your privacy settings to finish setting up your profile
              </p>
            </div>
            
            <Card className="border-cosmic-purple/30 bg-deep-space/50">
              <CardHeader className="pb-2">
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>
                  Make your profile visible in the Teams directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-star-white/80">
                      When enabled, other users can see your profile, skills, and send you match requests
                    </p>
                  </div>
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-cosmic-purple/10 border border-cosmic-purple/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">How we use your information</h4>
              <ul className="text-sm space-y-2 text-star-white/80">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-cosmic-purple" />
                  <span>Your profile is only visible to others if you enable "Public Profile"</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-cosmic-purple" />
                  <span>You can edit your profile or change privacy settings anytime</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-cosmic-purple" />
                  <span>We never share your information with third parties</span>
                </li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
            {profile ? "Update Your Profile" : "Welcome to 抱團Vibe!"}
          </h1>
          <p className="text-star-white/80">
            {profile 
              ? "Update your profile to help others find and connect with you" 
              : "Let's set up your profile to help you find your perfect team"
            }
          </p>
        </div>
        
        {/* Progress bar and steps */}
        <div className="mb-8">
          <Progress value={(currentStep + 1) / STEPS.length * 100} className="h-2 mb-4" />
          <div className="flex justify-between">
            {STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`text-center flex-1 ${
                  index < currentStep 
                    ? 'text-cosmic-purple' 
                    : index === currentStep 
                    ? 'text-stellar-blue' 
                    : 'text-star-white/40'
                }`}
              >
                <div className="hidden md:block text-sm">{step.title}</div>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mx-auto ${
                  index < currentStep 
                    ? 'bg-cosmic-purple text-white' 
                    : index === currentStep 
                    ? 'border-2 border-stellar-blue' 
                    : 'border border-star-white/40'
                }`}>
                  {index < currentStep ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current step title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{STEPS[currentStep]?.title}</h2>
          <p className="text-star-white/60">{STEPS[currentStep]?.description}</p>
        </div>
        
        {/* Step content */}
        <Card className="bg-gradient-to-br from-deep-space to-deep-space/70 border border-white/10">
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
          <CardFooter className="flex justify-between pt-2 pb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={currentStep === 0 && !formData.display_name}
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving || !formComplete}
                className="bg-cosmic-purple hover:bg-cosmic-purple/90"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 