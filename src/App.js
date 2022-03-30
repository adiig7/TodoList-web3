import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import Task from './Task';
import './App.css';

import { TaskContractAddress } from './config.js';
import { ethers } from 'ethers';
import TaskAbi from './utils/TaskContract.json';
import background from "./utils/back.jpeg";


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorretNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not found");
        return;
      }
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      const rinkebyChainId = '0x4';

      if (chainId !== rinkebyChainId) {
        return;
      } else {
        setCorretNetwork(true);
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      
    }
  }

  const addTask = async () => {
    let task = {
      'taskText': input,
      'isDeleted': false
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then(response => {
            setTasks([...tasks, task]);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } catch (err) {
      
    }
    setInput('');
  }
  

  const deleteTask = key => async () => {
    console.log(key);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
        let deleteTx = await TaskContract.deleteTask(key, true);
        let allTasks = await TaskContract.getAllTasks();
        setTasks(allTasks);
      }
    } catch (err) {

    }
    setInput('');
  }

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);

  return (
    <div style = {{
      backgroundImage: `url(${background})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: 'fit-content',
      minHeight:"100vh"
      }} >
      {currentAccount === '' ? (
        <button
          className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div className="App">
          <h1 style={{color:"white", padding:"20px 0px"}}> TodoList Dapp</h1>
          <form>
              <TextField sx={{ input: { color: 'yellow' } }}id="outlined-basic" label="Make Todo" variant="outlined" style={{ margin: "0px 5px 15px 5px" ,width:"250px",color:"white"}} size="sm" value={input}
                onChange={e => setInput(e.target.value)} />
              <div>
                <Button variant="contained" className={ "button1"} color='success' onClick={addTask} style={{marginBottom:"20px"}} >Add Task</Button>
              </div>
          </form>
          <ul>
            {tasks.map(item =>
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              />)
            }
          </ul>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
          <div>----------------------------------------</div>
          <div>Please connect to the Rinkeby Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  )
      }

export default App