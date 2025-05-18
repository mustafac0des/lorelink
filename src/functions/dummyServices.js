export const DUMMY_USERS = [
  {
    uid: 'user1',
    username: 'sarah123',
    name: 'Sarah Johnson',
    picture: 'https://randomuser.me/api/portraits/women/1.jpg',
    isFollowed: false,
    biography: 'A bibliophile and aspiring novelist weaving tales of love and adventure.'
  },
  {
    uid: 'user2',
    username: 'michael13',
    name: 'Michael Chen',
    picture: 'https://randomuser.me/api/portraits/men/2.jpg',
    isFollowed: true,
    biography: 'Editor and writer crafting compelling narratives and reviewing contemporary literature.'
  },
  {
    uid: 'user3',
    username: 'wilsonemma',
    name: 'Emma Wilson',
    picture: 'https://randomuser.me/api/portraits/women/3.jpg',
    isFollowed: false,
    biography: 'Storyteller through photography and prose, capturing worlds both real and imagined.'
  },
  {
    uid: 'user4',
    username: 'jr1',
    name: 'James Rodriguez',
    picture: 'https://randomuser.me/api/portraits/men/4.jpg',
    isFollowed: true,
    biography: 'Game developer by trade, fantasy novelist by night, creating immersive sagas.'
  },
  {
    uid: 'user5',
    username: 'sopheeee',
    name: 'Sophia Lee',
    picture: 'https://randomuser.me/api/portraits/women/5.jpg',
    isFollowed: false,
    biography: 'Children\'s book author and illustrator inspiring young minds through whimsical stories.'
  }
];

export const DUMMY_POSTS = [
  {
    pid: 'post1',
    uid: 'user1',
    postText: `Last night I immersed myself in a tale of forgotten realms, where emerald forests whispered ancient secrets and moonlit rivers carried the dreams of weary travelers. The protagonist, a young cartographer named Elara, sets out with little more than a battered map and an unbreakable resolve to chart lands long lost to legend. Each step reveals crumbling towers, hidden runes glowing beneath moss, and shadow creatures lurking at the edge of her lantern’s light. The journey tests her courage, unearths family betrayals, and teaches her that some destinies are written not in ink, but in the heart. By dawn’s first light, Elara finds not just new lands, but a new sense of purpose—proof that even the smallest spark can ignite great adventures.`,
    datePosted: new Date(Date.now() - 3600000).toLocaleString(),
    likes: { user2: true, user3: true, user4: true },
    comments: [
      { uid: 'user2', text: 'Elara’s journey sounds captivating! Which betrayal scene stood out for you?', dateCommented: new Date(Date.now() - 10100000).toLocaleString() },
      { uid: 'user4', text: 'The imagery of the runes illuminated by moss is stunning—reminds me of old folklore!', dateCommented: new Date(Date.now() - 10200001).toLocaleString() }
    ]
  },
  {
    pid: 'post2',
    uid: 'user2',
    postText: `Tonight I reopened a vintage mystery novel that begins with an unexplained disappearance on a fog-laden train. The narrative unravels through letters, diary entries, and newspaper clippings, each adding a piece to the puzzle. The central character, Detective Rowan Pierce, must navigate a web of deceit spun by aristocrats and street urchins alike. Every clue—an embroidered handkerchief, a chipped teacup, a single glove found in the snow—hints at secrets buried deeper than the tracks themselves. As the locomotive hurtles toward the final station, the tension crescendos, revealing that even trusted allies harbor hidden motives. This classic whodunit reminds me why I love mysteries: the thrill of deduction and the silent gasp when the final truth is laid bare.`,
    datePosted: new Date(Date.now() - 7200000).toLocaleString(),
    likes: { user1: true, user5: true },
    comments: [
      { uid: 'user5', text: 'This setup gives me chills! Do you think Detective Pierce is led astray by the aristocrats?', dateCommented: new Date(Date.now() - 10800000).toLocaleString() }
    ]
  },
  {
    pid: 'post3',
    uid: 'user3',
    postText: `I’m thrilled to announce the launch of my StorySphere app, a curated anthology of short narratives from writers across six continents. Within its sleek interface, you’ll discover everything from a steamed bun that holds the essence of a grandmother’s memory to a futuristic city run by sentient libraries. Each tale spans genres—magical realism, historical fiction, sci-fi—yet all celebrate the power of the written word. I spent months selecting stories that provoke thought, evoke emotion, and spark creativity. The app’s built-in reading circle feature allows you to discuss interpretations in real time. My hope is that StorySphere becomes more than an app; it’s a bridge uniting readers and writers through shared imagination. Download it and lose yourself in worlds you never knew existed.`,
    datePosted: new Date(Date.now() - 10800000).toLocaleString(),
    likes: { user1: true, user2: true, user4: true, user5: true },
    comments: [
      { uid: 'user1', text: 'Incredible work! The grandmother’s memory story moved me to tears.', dateCommented: new Date(Date.now() - 11100000).toLocaleString() },
      { uid: 'user4', text: 'StorySphere sounds groundbreaking—what was the hardest genre to curate?', dateCommented: new Date(Date.now() - 10700000).toLocaleString() },
      { uid: 'user2', text: 'Already downloading! Kudos on this amazing achievement.', dateCommented: new Date(Date.now() - 10900000).toLocaleString() }
    ]
  },
  {
    pid: 'post4',
    uid: 'user4',
    postText: `In my latest design experiment, I’ve woven narrative hooks directly into each level of my upcoming fantasy game. Players begin in a crumbling port town, where sailors share rumors of sea serpents guarding sunken treasure. Later, they traverse a haunted forest echoing with ancient ballads sung by restless spirits. By collecting fragmentary journal entries, players piece together a legend of star-born heroes and tragic betrayals, their choices altering the storyline in real time. My goal is to blur the line between gameplay and storytelling, making every enemy encounter and puzzle feel like a chapter in an epic saga. Testing feedback has been exhilarating: one player said she felt like a true protagonist in a living story.`,
    datePosted: new Date(Date.now() - 14400000).toLocaleString(),
    likes: { user3: true, user5: true },
    comments: [
      { uid: 'user5', text: 'Integration of ballads sounds unique! How do you ensure they flow with gameplay?', dateCommented: new Date(Date.now() - 10500000).toLocaleString() }
    ]
  },
  {
    pid: 'post5',
    uid: 'user5',
    postText: `I’m overjoyed to share that I’ve completed my first children’s bedtime story, "The Moonlit Meadow." It follows a timid firefly named Luna who discovers her glow can guide lost forest creatures back home. Along her journey, she befriends a shy hedgehog and a curious frog, each teaching her the value of courage and kindness. I spent weeks crafting rhythmic verses to soothe little listeners, paired with gentle illustrations of pastel skies and twinkling stars. My hope is that the story not only sparks young imaginations but also offers a calming ritual before sleep. Thank you to everyone who encouraged me—now it’s in your hands to share bedtime magic with your family.`,
    datePosted: new Date(Date.now() - 18000000).toLocaleString(),
    likes: { user1: true, user2: true, user3: true, user4: true },
    comments: [
      { uid: 'user1', text: 'Luna’s adventure sounds enchanting! Perfect for bedtime.', dateCommented: new Date(Date.now() - 9900000).toLocaleString() },
      { uid: 'user3', text: 'The verses sound so soothing—how long did it take to find the right rhythm?', dateCommented: new Date(Date.now() - 10300000).toLocaleString() }
    ]
  }
];


export const getPost = (pid) => {
  const postData = DUMMY_POSTS.find(post => post.pid === pid) || null;
  if (!postData) return null;

  const enrichedComments = postData.comments.map(c => {
    const commenter = DUMMY_USERS.find(u => u.uid === c.uid) || {};
    return {
      id:            c.uid + '_' + (c.dateCommented||Date.now()),
      text:          c.text,
      timestamp:     c.dateCommented,
      username:          commenter.username,
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
      username:     author.username || 'Unknown',
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
