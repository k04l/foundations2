// src/components/ProfileImage.tsx

const ProfileImage: React.FC<{ profile: Profile }> = ({ profile }) => {
    const imageUrl = profile.profilePicture?.url 
      ? `${window.location.origin}${profile.profilePicture.url}`
      : '/default-avatar.png';  // Add a default image
  
    return (
      <div className="w-32 h-32 mx-auto md:mx-0 mb-4">
        <img
          src={imageUrl}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-full h-full rounded-full object-cover border-2 border-blue-500"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
      </div>
    );
  };