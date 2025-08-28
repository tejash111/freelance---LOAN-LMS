import { adminAuth } from '../../../firebase/admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.body;
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    res.status(200).json({ 
      uid: decodedToken.uid,
      role: decodedToken.role || 'user',
      email: decodedToken.email 
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}