import React, { useState, useEffect } from "react";

interface Imam {
  id: number;
  name: string;
  phone: string;
}

export const ImamList: React.FC = () => {
  const [imams, setImams] = useState<Imam[]>([]);

  useEffect(() => {
    fetch("https://sunset-nosy-toast.glitch.me/imams")
      .then((response) => response.json())
      .then((data) => setImams(data));
  }, []);

  return (
    <div>
      <h1>Imam List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {imams.map((imam) => (
            <tr key={imam.id}>
              <td>{imam.id}</td>
              <td>{imam.name}</td>
              <td>{imam.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImamList;
