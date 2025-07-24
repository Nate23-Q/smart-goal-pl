import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:3002/goals'

function App() {
  const [goals, setGoals] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    category: '',
    deadline: ''
  })
  const [deposit, setDeposit] = useState({ goalId: '', amount: '' })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setGoals(data)
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const addGoal = async (e) => {
    e.preventDefault()
    try {
      const goal = {
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        savedAmount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      })
      
      if (response.ok) {
        fetchGoals()
        setNewGoal({ name: '', targetAmount: '', category: '', deadline: '' })
        setShowAddForm(false)
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    }
  }

  const deleteGoal = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      fetchGoals()
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const makeDeposit = async (e) => {
    e.preventDefault()
    try {
      const goal = goals.find(g => g.id === deposit.goalId)
      const updatedGoal = {
        ...goal,
        savedAmount: goal.savedAmount + parseFloat(deposit.amount)
      }
      
      await fetch(`${API_URL}/${deposit.goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      })
      
      fetchGoals()
      setDeposit({ goalId: '', amount: '' })
      setShowDepositForm(false)
    } catch (error) {
      console.error('Error making deposit:', error)
    }
  }

  const getProgressPercentage = (saved, target) => Math.min((saved / target) * 100, 100)

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getGoalStatus = (goal) => {
    const daysLeft = getDaysUntilDeadline(goal.deadline)
    const isComplete = goal.savedAmount >= goal.targetAmount
    
    if (isComplete) return 'complete'
    if (daysLeft < 0) return 'overdue'
    if (daysLeft <= 30) return 'warning'
    return 'normal'
  }

  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0)
  const completedGoals = goals.filter(goal => goal.savedAmount >= goal.targetAmount).length

  return (
    <div className="app">
      <header>
        <h1>Smart Goal Planner</h1>
        <div className="overview">
          <div className="stat">
            <span className="label">Total Goals:</span>
            <span className="value">{goals.length}</span>
          </div>
          <div className="stat">
            <span className="label">Total Saved:</span>
            <span className="value">${totalSaved.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Completed:</span>
            <span className="value">{completedGoals}</span>
          </div>
        </div>
      </header>

      <div className="actions">
        <button onClick={() => setShowAddForm(true)}>Add Goal</button>
        <button onClick={() => setShowDepositForm(true)}>Make Deposit</button>
      </div>

      {showAddForm && (
        <div className="modal">
          <form onSubmit={addGoal}>
            <h3>Add New Goal</h3>
            <input
              type="text"
              placeholder="Goal name"
              value={newGoal.name}
              onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              required
            />
            <input
              type="number"
              placeholder="Target amount"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
              required
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Add Goal</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showDepositForm && (
        <div className="modal">
          <form onSubmit={makeDeposit}>
            <h3>Make Deposit</h3>
            <select
              value={deposit.goalId}
              onChange={(e) => setDeposit({...deposit, goalId: e.target.value})}
              required
            >
              <option value="">Select a goal</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Deposit amount"
              value={deposit.amount}
              onChange={(e) => setDeposit({...deposit, amount: e.target.value})}
              required
            />
            <div className="form-actions">
              <button type="submit">Make Deposit</button>
              <button type="button" onClick={() => setShowDepositForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="goals-grid">
        {goals.map(goal => {
          const progress = getProgressPercentage(goal.savedAmount, goal.targetAmount)
          const status = getGoalStatus(goal)
          const daysLeft = getDaysUntilDeadline(goal.deadline)
          
          return (
            <div key={goal.id} className={`goal-card ${status}`}>
              <div className="goal-header">
                <h3>{goal.name}</h3>
                <button onClick={() => deleteGoal(goal.id)} className="delete-btn">×</button>
              </div>
              
              <div className="goal-info">
                <p><strong>Category:</strong> {goal.category}</p>
                <p><strong>Target:</strong> ${goal.targetAmount.toLocaleString()}</p>
                <p><strong>Saved:</strong> ${goal.savedAmount.toLocaleString()}</p>
                <p><strong>Remaining:</strong> ${(goal.targetAmount - goal.savedAmount).toLocaleString()}</p>
                <p><strong>Deadline:</strong> {goal.deadline}</p>
                
                {status === 'complete' && <p className="status-msg complete">✓ Goal Complete!</p>}
                {status === 'overdue' && <p className="status-msg overdue">⚠ Overdue</p>}
                {status === 'warning' && <p className="status-msg warning">⚠ {daysLeft} days left</p>}
                {status === 'normal' && <p className="status-msg">{daysLeft} days left</p>}
              </div>
              
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}}></div>
              </div>
              <p className="progress-text">{progress.toFixed(1)}% complete</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App