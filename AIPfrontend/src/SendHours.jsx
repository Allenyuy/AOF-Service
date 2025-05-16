import { useEffect, useState } from 'react';

function SendHours() {
  // State to store logged-in user info
  const [user, setUser] = useState(null);

  // State for the form input fields
  const [form, setForm] = useState({
    requester: '',
    verifier: '',
    name: '',
    hours: '',
    description: '',
  });

  // States for UI feedback
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Runs once on component mount to fetch user info from localStorage and server
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      setError('No user email found.');
      return;
    }

    // Fetch user data from backend using stored email
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${email}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setUser(data);

        // Pre-fill form with user info
        setForm(prev => ({
          ...prev,
          requester: data.email,
          name: data.name,
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const sendHours = async () => {
    // Basic validation
    if (!form.verifier || !form.hours || !form.description) {
      setResponse('Please fill in all fields.');
      return;
    }

    // Ensure hours is a number
    const parsedHours = Number(form.hours);
    if (isNaN(parsedHours)) {
      setResponse('Hours must be a number.');
      return;
    }

    setLoading(true);
    try {
      // Send POST request with the form data
      const res = await fetch('http://localhost:8080/sendHours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hours: parsedHours }),
      });

      if (!res.ok) throw new Error(await res.text());
      await res.json();

      // Display success message
      setResponse('Hours submitted successfully.');
    } catch (err) {
      setResponse(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Display error if user email is missing or fetch failed
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Main form UI
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f5f5f5',
      fontSize: '1.2rem'
    }}>
      <div style={{
        padding: '2.5rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#fff',
        boxShadow: '0 0 15px rgba(0,0,0,0.15)',
        width: '400px',
        textAlign: 'center',
        color: 'black'
      }}>
        {/* Welcome header with user name */}
        <h2>Welcome{user ? `, ${user.name}` : ''}!</h2>
        <p><strong>Total Hours:</strong> {user?.hours ?? 'Loading...'}</p>

        {/* Submission form */}
        <h3>Submit Hours</h3>
        <input
          name="verifier"
          placeholder="Verifier Email"
          value={form.verifier}
          onChange={handleChange}
          style={{ marginBottom: '1rem', padding: '10px', width: '100%', fontSize: '1rem' }}
        />
        <input
          name="hours"
          placeholder="Hours"
          value={form.hours}
          onChange={handleChange}
          style={{ marginBottom: '1rem', padding: '10px', width: '100%', fontSize: '1rem' }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginBottom: '1.5rem', padding: '10px', width: '100%', fontSize: '1rem' }}
        />
        <button
          onClick={sendHours}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>

        {/* Response message after submission */}
        {response && <p style={{ marginTop: '1rem', color: response.startsWith('Error') ? 'red' : 'green' }}>{response}</p>}
      </div>
    </div>
  );
}

export default SendHours;
