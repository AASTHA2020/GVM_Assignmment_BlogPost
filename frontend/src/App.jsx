import BlogPage from './components/BlogPage'
import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <BlogPage />
      </div>
    </ThemeProvider>
  )
}

export default App
