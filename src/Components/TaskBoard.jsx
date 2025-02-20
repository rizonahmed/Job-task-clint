import { useContext, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskContext } from "../Context/TaskContext";
import TaskModal from "./TaskModal";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const categories = ["To-Do", "In Progress", "Done"];

const TaskBoard = () => {
  const { tasks, updateTask, addTask, deleteTask } = useContext(TaskContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const task = tasks.find((t) => t._id === result.draggableId);
    if (task.category !== categories[result.destination.droppableId]) {
      updateTask({
        id: task._id,
        updatedTask: {
          ...task,
          category: categories[result.destination.droppableId],
        },
      });
    }
  };

  const handleAddTask = (newTask) => {
    addTask(newTask);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Droppable key={category} droppableId={`${index}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 rounded-lg shadow-sm p-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-lg text-gray-900">
                        {category}
                      </h2>
                      {category === "To-Do" && (
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <PlusIcon className="h-5 w-5 text-gray-600" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.category === category)
                        .map((task, idx) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={idx}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all group relative border border-gray-100"
                              >
                                {/* Task Content */}
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-gray-900 pr-8">
                                    Title: {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm text-gray-600">
                                    Description:  {task.description}
                                    </p>
                                  )}
                                  <p>
                                   Type: {task.category}
                                  </p>

                                  {/* Task Footer */}
                                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                    {/* Timestamp */}
                                    <div className="flex items-center text-xs text-gray-500">
                                      <ClockIcon className="w-4 h-4 mr-1" />
                                      {new Date(
                                        task?.createdAt
                                      ).toLocaleDateString()}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => handleEditTask(task)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                      >
                                        <PencilIcon className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteTask(task._id)
                                        }
                                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                      >
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        closeModal={() => {
          setIsModalOpen(false);
          setEditingTask(null); // Reset editing task when closing
        }}
        onSubmit={(taskData) => {
          if (editingTask) {
            updateTask({
              id: editingTask._id,
              updatedTask: taskData,
            });
          } else {
            addTask(taskData);
          }
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialData={editingTask} // Pass the task being edited
      />
    </>
  );
};

export default TaskBoard;
