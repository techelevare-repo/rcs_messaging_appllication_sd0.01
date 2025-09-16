

// import { useState } from 'react';
// import '../page/Login.css';

// export default function Login() {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Login attempt:', { username, password });
//         alert(`Logging in with Username: ${username} and Password: ${password}`);
//         // Add your API call logic here
//     };

//     return (
//         <div className="login-wrapper">
//             <div className="login-container">
//                 <h2>Login to RadiologyAI</h2>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         placeholder="Username"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                     <button type="submit" >
//                         Login
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import '../page/Login.css';

export default function AuthForm() {
  // toggle login/register
  const [isLogin, setIsLogin] = useState(true);

  // login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // register fields
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // handle login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(`Login: ${loginUsername}, ${loginPassword}`);
  };

  // handle register
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert(
      `Register: ${registerUsername}, ${registerEmail}, ${registerPassword}`
    );
  };

  // disable if fields empty
  const isLoginDisabled =
    loginUsername.trim() === '' || loginPassword.trim() === '';
  const isRegisterDisabled =
    registerUsername.trim() === '' ||
    registerEmail.trim() === '' ||
    registerPassword.trim() === '';

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {isLogin ? (
          <>
            <h2>Login to RadiologyAI</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoginDisabled}>
                Login
              </button>
            </form>

            <div style={{ marginTop: '10px' }}>
              <a href="#" onClick={() => alert('Forgot password flow')}>
                Forgot Password?
              </a>
            </div>

            <div style={{ marginTop: '10px' }}>
              New user?{' '}
              <a href="#" onClick={() => setIsLogin(false)}>
                Register now
              </a>
            </div>
          </>
        ) : (
          <>
            <h2>Register for RadiologyAI</h2>
            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={isRegisterDisabled}>
                Register
              </button>
            </form>

            <div style={{ marginTop: '10px' }}>
              Already have an account?{' '}
              <a href="#" onClick={() => setIsLogin(true)}>
                Login here
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
