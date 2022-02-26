import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import UserService from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])
  useEffect(() => {
    store.checkAuth()
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers()
      setUsers(response.data)
    } catch (e) {
      console.log(e);
    }

  }

  if(store.isLoading) {
    return <div>Loading...</div>
  }

  if(!store.isAuth) {
    return  (<LoginForm/>)
  }

  return (
    <div>
      <h1>{store.isAuth ? `User ${store.user.email} is authorized` : `User is not authorized`}</h1>
      <h1>{store.user.isActivated ? 'activated' : 'NOT activated'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <button onClick={getUsers}>Get Users</button>
      {users.map(user => {
        return <div key={user.email}>{user.email}</div>
      })}
    </div>
  );
}

export default observer(App);
