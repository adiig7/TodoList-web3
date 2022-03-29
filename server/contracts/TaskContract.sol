// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

contract TaskContract {
    event AddTask(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);

    struct Task{
        uint id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(uint => address) taskToOwner;

    function addTask(string memory taskText, bool isDeleted) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, taskText, isDeleted));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function getMyTasks() external view returns (Task[] memory){
     Task[] memory temporaryTasks = new Task[](tasks.length);
        uint count = 0;
        for(uint i = 0; i < tasks.length; i++){
            if(tasks[i].isDeleted == false){
                temporaryTasks[count] = tasks[i];
                count++;
            }
        }

        Task[] memory result = new Task[](count);

        for(uint i = 0; i < count; i++){
            result[i] = temporaryTasks[i];
        }
        return result;
    }

   function deleteTask(uint taskId, bool isDeleted) external {
        if(taskToOwner[taskId] == msg.sender) {
            tasks[taskId].isDeleted = isDeleted;
            emit DeleteTask(taskId, isDeleted);
        }
    }
}