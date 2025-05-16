import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import SendHours from './SendHours';
import ApproveHours from './ApproveHours';

function App() {
  return (
    <BrowserRouter> // create router
      <Routes>
        <Route path="/" element={<Login />} />// path to login page
        <Route path="/send-hours" element={<SendHours />} />// path to send Hours
        <Route path="/approve-hours" element={<ApproveHours />} />// path to approveHours
      </Routes>
    </BrowserRouter>
  );
}

export default App;
