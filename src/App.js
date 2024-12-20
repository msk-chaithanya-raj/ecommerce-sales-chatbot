import React, { useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;
    const newMessage = {
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      sender: "user",
    };
    setMessages([...messages, newMessage]);
    setInput("");

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/search?query=${input}`
      );
      const botMessage = {
        text: `Found products: ${response.data.map((p) => p.name).join(", ")}`,
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setProducts(response.data);
    } catch (error) {
      const botMessage = {
        text: "Sorry, I couldn't fetch product details.",
        timestamp: new Date().toLocaleTimeString(),
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
    setIsLoading(false);
  };

  const login = () => {
    setIsAuthenticated(true);
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to E-Commerce Chatbot</h1>
      </header>

      {isAuthenticated ? (
        <div className="chat-container">
          <div className="chat-box">
            {messages.map((message, index) => (
              <div key={index} className={message.sender}>
                <span className="timestamp">{message.timestamp}</span>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search products..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
          {isLoading && <p>Loading...</p>}
          <button className="reset" onClick={resetChat}>
            Reset
          </button>
          <div className="products-list">
            {products.length > 0 && (
              <ul>
                {products.map((product) => (
                  <li key={product.id}>
                    <strong>{product.name}</strong> - ${product.price}
                    <br />
                    <small>{product.description}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="login-screen">
          <h2>Please Login</h2>
          <button onClick={login}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;
