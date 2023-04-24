import { useState, useEffect } from "react";

import "./styles.css";

export default function App() {
  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetch("https://random-data-api.com/api/users/random_user?size=10")
      .then((response) => response.json())

      .then((data) => {
        const formattedData = data.map((user) => {
          // *// Format date_of_birth to dd-mm-yyyy*

          const dateOfBirth = new Date(user.date_of_birth);

          const formattedDateOfBirth = `${dateOfBirth

            .getDate()

            .toString()

            .padStart(2, "0")}-${(dateOfBirth.getMonth() + 1)

            .toString()

            .padStart(2, "0")}-${dateOfBirth.getFullYear()}`;

          // *// Calculate age*

          const now = new Date();

          let age = now.getFullYear() - dateOfBirth.getFullYear();

          if (
            now.getMonth() < dateOfBirth.getMonth() ||
            (now.getMonth() === dateOfBirth.getMonth() &&
              now.getDate() < dateOfBirth.getDate())
          ) {
            age--;
          }

          return {
            ...user,

            date_of_birth: formattedDateOfBirth,

            age: age
          };
        });

        setUsers(formattedData);
      });
  }, []);

  const handleSortByChange = (event) => {
    const sortBy = event.target.value;

    setSortBy(sortBy);
  };

  const handleSearchTermChange = (event) => {
    const searchTerm = event.target.value;

    setSearchTerm(searchTerm);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (sortBy === "name") {
    filteredUsers.sort((a, b) => (a.username > b.username ? 1 : -1));
  } else if (sortBy === "birthday-day") {
    filteredUsers.sort((a, b) => {
      const aDay = parseInt(a.date_of_birth.substring(0, 2));

      const bDay = parseInt(b.date_of_birth.substring(0, 2));

      return aDay - bDay;
    });
  } else if (sortBy === "birthday-month") {
    filteredUsers.sort((a, b) => {
      const aMonth = parseInt(a.date_of_birth.substring(3, 5));

      const bMonth = parseInt(b.date_of_birth.substring(3, 5));

      return aMonth - bMonth;
    });
  } else if (sortBy === "birthday-year") {
    filteredUsers.sort((a, b) => {
      const aYear = parseInt(a.date_of_birth.substring(6, 10));

      const bYear = parseInt(b.date_of_birth.substring(6, 10));

      return aYear - bYear;
    });
  }

  return (
    <div className="App">
      <h1>Hello Egitech members</h1>

      <h2>Start fill data and sort in 5 mins</h2>

      <h3>https://random-data-api.com/api/users/random_user?size=10</h3>

      <div>
        <label htmlFor="sort-by">Sort by:</label>

        <select id="sort-by" value={sortBy} onChange={handleSortByChange}>
          <option value="">Select an option</option>

          <option value="name">Name</option>

          <option value="birthday-day">Birthday (day)</option>

          <option value="birthday-month">Birthday (month)</option>

          <option value="birthday-year">Birthday (year)</option>
        </select>
      </div>

      <div>
        <label htmlFor="search-term">Search:</label>

        <input
          type="text"
          id="search-term"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>

            <th>Name</th>

            <th>Email</th>

            <th>Birthday</th>

            <th>Age</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>{user.username}</td>

              <td>{user.email}</td>

              <td>{user.date_of_birth}</td>

              <td>{user.age}</td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="5">No results found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
