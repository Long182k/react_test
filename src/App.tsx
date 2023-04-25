import { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

const calculateAge = (dateString: string) => {
  const now = new Date();
  const birthDate = new Date(dateString);
  const age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  return monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ? age - 1
    : age;
};

const App = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

    useEffect(() => {
      axios.get("https://random-data-api.com/api/users/random_user", {
          params: {
            size: 10
          }
        })
        .then((response: any) => {
          const formattedData = response.data.map((user: any) => ({
            ...user,
            date_of_birth: formatDate(user.date_of_birth),
            age: calculateAge(user.date_of_birth),
          }));
          setUsers(formattedData);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }, []);
  const handleSortByChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleSearchTermChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  let filteredUsers = [...users];

  if (searchTerm) {
    if (typeof searchTerm === "number") {
      filteredUsers = users.filter((user: any) => {
        return (user.age).includes( searchTerm) ||
          (user.birthday).includes(searchTerm);
      });
    } else if (typeof searchTerm === "string") {
      filteredUsers = users.filter((user) =>
        Object.values(user).some((value: any) => {
          if (typeof value === "string") {
            const lowerCaseValue = value.toLowerCase().trim();
            const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();
            return lowerCaseValue.includes(lowerCaseSearchTerm);
          } else if (typeof value === "number") {
            return value === parseInt(searchTerm);
          }
          return false;
        })
      );
    }
  }
  
  if (sortBy) {

    if (sortBy === "name") {
      filteredUsers.sort((a: any, b: any) => (a.username > b.username ? 1 : -1));
    } else if (sortBy === "birthday-day") {
      filteredUsers.sort((a: any, b: any) => {
        const aDay = parseInt(a.date_of_birth.substring(0, 2));
        const bDay = parseInt(b.date_of_birth.substring(0, 2));
        return aDay - bDay;
      });
    } else if (sortBy === "birthday-month") {
      filteredUsers.sort((a: any, b: any) => {
        const aMonth = parseInt(a.date_of_birth.substring(3, 5));
        const bMonth = parseInt(b.date_of_birth.substring(3, 5));
        return aMonth - bMonth;
      });
    } else if (sortBy === "birthday-year") {
      filteredUsers.sort((a: any, b: any) => {
        const aYear = parseInt(a.date_of_birth.substring(6, 10));
        const bYear = parseInt(b.date_of_birth.substring(6, 10));
        return aYear - bYear;
      });
    } else if (sortBy === "ascending-birthday") {
      filteredUsers.sort((a: any, b: any) => {
        const aDateParts = a.date_of_birth.split("-").reverse();
        const bDateParts = b.date_of_birth.split("-").reverse();
        const aDate = new Date(`${aDateParts.join("-")}T00:00:00`);
        const bDate = new Date(`${bDateParts.join("-")}T00:00:00`);
        return aDate.getTime() - bDate.getTime();
      });
    } 

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
          <option value="ascending-birthday">Ascending Birthday</option>
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user: any, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.date_of_birth}</td>
                <td>{user.age}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No results found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;


