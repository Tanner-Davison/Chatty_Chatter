import { useState, useEffect } from 'react';

const useAuth = () => {
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: '',
    password: '',
    imageUrl: '',
    cloudinary_id: '',
  });

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('active_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserLoginInfo({
          username: parsedUser.username,
          password: parsedUser.password,
          imageUrl: parsedUser.imageUrl || 'default_url',
          cloudinary_id: parsedUser.cloudinary_id || 'default_id',
        });
      } else {
        const newUserInfo = {
          username: JSON.parse(sessionStorage.getItem('username')),
          password: JSON.parse(sessionStorage.getItem('password')),
          imageUrl:
            sessionStorage.getItem('image-url') ||
            'https://m.media-amazon.com/images/I/71zTE0u2iXL._AC_UY1000_.jpg',
          cloudinary_id:
            sessionStorage.getItem('cloudinary_id') ||
            'https://m.media-amazon.com/images/I/71zTE0u2iXL._AC_UY1000_.jpg',
        };
        setUserLoginInfo(newUserInfo);
      }
    } catch (error) {
      console.error('Could not retrieve or parse user session info', error);
    }
  }, []);

  return { userLoginInfo, setUserLoginInfo };
};

export default useAuth;