
<h1>Gender vs Gender Website</h1>
Welcome to the official GitHub repository for the Gender vs Gender website! Dive into some live, interactive debates on gender topics, share your insights, and see what others have to say.

<h2>Overview</h2>
Gender vs Gender is a dynamic platform where users can login, engage in active debates on various gender topics, and vote on the responses they resonate with the most. Every 30 minutes, a new topic is introduced, ensuring that the discussions remain fresh and engaging.

<h2>Features</h2>
<h3>Live Debates:</h3> Connect to a live server and engage in real-time discussions.
Dynamic Topics: Every half an hour, a new gender topic pops up, ready for your insights!
Community Engagement: Submit your responses and see what the community thinks.
Voting System: Upvote the responses you agree with. The top-voted response earns points for the round.
Database Integration: All answers are securely saved, ensuring that every voice is heard.

<h2>Getting Started</h2>
Head over to gender v/s gender and sign up.
Once logged in, you'll be directed to the current live debate.
Share your thoughts, vote on others, and let the best response win!


<table>
  <tr>
    <th>Tech Stack</th>
  
  </tr>
  <tr>
    <td>Frontend: </td>
    <td>React</td>
  </tr>
 <tr>
   <td>Backend: </td>
   <td>Express.js</td>
  </tr>
  <tr>
   <td>DataBase: </td>
   <td>postgres</td>
  </tr>


<h2>Contributing</h2>
We are always open to improvements! If you have suggestions, bug reports, or feature requests, please open an issue. If you'd like to contribute directly, feel free to fork the repository and submit a pull request.
<br></br>
<br></br>



| | Backend Basics
-|-
Version Control: |  git
Server: | Node.js --> express.js
WebSocket Setup | socket.io 
User Profiles: | Store and retrieve user profile data like avatars, usernames, etc.
Message Storage: | Store chat messages in the database for history or potential future features.

|| Frontend 
-|-
Framework: |  React --> create-react-app
Chat Interface: | Build a basic chat interface component
Connect to  Frontend: | Implement basic message sending and receiving functionality.

|| User Auth
-|-
Login/Logout: | Implement user sign-up and login functionality on the backend.
Components: | Create frontend components for login and sign-up forms.
Integration: | Integrate the frontend and backend authentication. Ensure that users are authenticated before they can send messages.

 | | ChatGPT API
-|-
Generate Topics: | Use the OpenAI API (or another provider's API) to generate debate topics.
Event Action: | Implement a button or an event trigger on the frontend to fetch a topic.
Display: | Display the topic prominently in the chat interface.


License
This project is licensed under the MIT License.


