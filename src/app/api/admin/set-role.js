import { adminAuth } from '../../../firebase/admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify the request is from an admin
    const token = req.headers.authorization?.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (decodedToken.role !== '') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { uid, role } = req.body;

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, { role });

    res.status(200).json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error setting role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}