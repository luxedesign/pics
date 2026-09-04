const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './key.json' });

const SECRET_PASSWORD = "tripleX9090"; 
const BUCKET_NAME = "dirtyvids";

exports.getVideoUrl = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const { password, fileName } = req.body || {};

  if (!password || password !== SECRET_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000,
  };

  try {
    const [url] = await storage
      .bucket(BUCKET_NAME)
      .file(fileName || '58.mp4')
      .getSignedUrl(options);

    return res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate link' });
  }
};
