const DUMMY_USERS = [
  {
    uid: 'user1',
    username: 'sarah123',
    name: 'Sarah Johnson',
    picture: 'https://randomuser.me/api/portraits/women/1.jpg',
    isFollowed: false,
    biography: 'A freelance writer with a passion for storytelling and exploring different cultures through travel and cuisine.'
  },
  {
    uid: 'user2',
    username: 'michael13',
    name: 'Michael Chen',
    picture: 'https://randomuser.me/api/portraits/men/2.jpg',
    isFollowed: true,
    biography: 'Software engineer by day, marathon runner by weekend. Loves coding clean solutions and helping startups scale.'
  },
  {
    uid: 'user3',
    username: 'wilsonemma',
    name: 'Emma Wilson',
    picture: 'https://randomuser.me/api/portraits/women/3.jpg',
    isFollowed: false,
    biography: 'Photographer and content creator sharing moments from around the globe. Believer in the power of visual storytelling.'
  },
  {
    uid: 'user4',
    username: 'jr1',
    name: 'James Rodriguez',
    picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    isFollowed: true,
    biography: 'Aspiring game developer with a love for retro games and electronic music. Always learning and building.'
  },
  {
    uid: 'user5',
    username: 'sopheeee',
    name: 'Sophia Lee',
    picture: 'https://randomuser.me/api/portraits/women/5.jpg',
    isFollowed: false,
    biography: 'Yoga instructor and wellness coach focused on helping people achieve balance through mindful living and fitness.'
  }
];

const DUMMY_POSTS = [
  {
    pid: 'post1',
    uid: 'user1',
    postText: 'Just finished reading an amazing book on artificial intelligence and its impact on society...',
    datePosted: new Date(Date.now() - 3600000).toLocaleString(),
    likes: { user2: true, user3: true, user4: true },
    comments: [
      { uid: 'user2', text: 'Great insights! Would love to discuss more about this.', dateCommented: new Date(Date.now() - 10100000).toLocaleString() },
      { uid: 'user4', text: 'AI is definitely changing everything!', dateCommented: new Date(Date.now() - 10200001).toLocaleString() }
    ]
  },
  {
    pid: 'post2',
    uid: 'user2',
    postText: 'Exploring new hiking trails today!...',
    datePosted: new Date(Date.now() - 7200000).toLocaleString(),
    likes: { user1: true, user5: true },
    comments: [
      { uid: 'user5', text: 'Wow, looks amazing! Which trail is this?', dateCommented: new Date(Date.now() - 10800000).toLocaleString() }
    ]
  },
  {
    pid: 'post3',
    uid: 'user3',
    postText: 'Just launched my first mobile app!...',
    datePosted: new Date(Date.now() - 10800000).toLocaleString(),
    likes: { user1: true, user2: true, user4: true, user5: true },
    comments: [
      { uid: 'user1', text: 'Congratulations! Can\'t wait to try it out!', dateCommented: new Date(Date.now() - 11100000).toLocaleString() },
      { uid: 'user4', text: 'This is incredible! Well done!', dateCommented: new Date(Date.now() - 10700000).toLocaleString() },
      { uid: 'user2', text: 'Amazing achievement! 🎉', dateCommented: new Date(Date.now() - 10900000).toLocaleString() }
    ]
  },
  {
    pid: 'post4',
    uid: 'user4',
    postText: 'Trying out a new recipe today - homemade sushi rolls!...',
    datePosted: new Date(Date.now() - 14400000).toLocaleString(),
    likes: { user3: true, user5: true },
    comments: [
      { uid: 'user5', text: 'Looks delicious! Share the recipe please!', dateCommented: new Date(Date.now() - 10500000).toLocaleString() },
    ]
  },
  {
    pid: 'post5',
    uid: 'user5',
    postText: 'Just completed my first marathon!...',
    datePosted: new Date(Date.now() - 18000000).toLocaleString(),
    likes: { user1: true, user2: true, user3: true, user4: true },
    comments: [
      { uid: 'user1', text: 'You\'re such an inspiration! 🎉' },
      { uid: 'user3', text: 'Amazing achievement! How do you feel?', dateCommented: new Date(Date.now() - 10300000).toLocaleString() }
    ]
  }
];

export const getHomePosts = () => {
  return DUMMY_POSTS.map(post => {
    const user = DUMMY_USERS.find(u => u.uid === post.uid);
    return {
      ...post,
      user: {
        uid: user?.uid,
        name: user?.name || 'Unknown',
        picture: user?.picture || ''
      },
      likeCount: Object.keys(post.likes || {}).length,
      commentCount: post.comments?.length || 0
    };
  });
};

export const getPost = (pid) => {
  const postData = DUMMY_POSTS.find(post => post.pid === pid) || null;
  if (!postData) return null;

  const enrichedComments = postData.comments.map(c => {
    const commenter = DUMMY_USERS.find(u => u.uid === c.uid) || {};
    return {
      id:            c.uid + '_' + (c.dateCommented||Date.now()),
      text:          c.text,
      timestamp:     c.dateCommented,
      name:          commenter.name,
      userPicture:     commenter.picture || DEFAULT_AVATAR,
    };
  });  

  const author = DUMMY_USERS.find(u => u.uid === postData.uid) || {};

  return {
    pid:         postData.pid,
    uid:         postData.uid,
    postText:    postData.postText,
    datePosted:  postData.datePosted,
    likes:       postData.likes,
    comments:    enrichedComments,
    likeCount:   Object.keys(postData.likes || {}).length,
    commentCount:postData.comments?.length || 0,
    user: {
      name:     author.name || 'Unknown',
      picture:  author.picture || ''
    },
  };
};


export const getUserPosts = async (uid) => {
  return DUMMY_POSTS.filter(post => post.uid === uid).map(post => ({
    pid: post.pid,
    postText: post.postText,
    datePosted: post.datePosted,
    likeCount: Object.keys(post.likes || {}).length,
    commentCount: post.comments?.length || 0
  }));
};

export const getUserProfile = async (uid) => {
  return DUMMY_USERS.find(user => user.uid === uid) || null;
};

export const getUserActivity = async (uid) => {
  const posts = DUMMY_POSTS.filter(post => post.uid === uid);
  const comments = [];

  DUMMY_POSTS.forEach(post => {
    post.comments?.forEach(comment => {
      if (comment.uid === uid) {
        comments.push({ pid: post.pid, text: comment.text, postText: post.postText, uid });
      }
    });
  });

  return { posts, comments };
};


export const getUserFollowersStatus = (uid) => {
  const user = DUMMY_USERS.find(u => u.uid === uid);
  if (!user) return null;

  return {
    followers: DUMMY_USERS.filter(u => u.isFollowed && u.uid !== uid),
    following: user.isFollowed ? [user] : []
  };
};
