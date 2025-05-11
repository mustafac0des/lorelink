export const fetchPosts = async () => {
  // Actual API call implementation
  return [
    {
      id: 1,
      userImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      userName: 'John Doe',
      datePosted: '2h',
      isFollowed: true,
      isGenerated: true,
      isEdited: false,
      postText: 'Took the time btw last night and today to reset all my yearly goals...',
      likeCount: 8,
      commentCount: 4
    },
    // Additional post objects
  ];
};