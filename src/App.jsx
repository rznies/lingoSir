import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { Create } from "./pages/Create"
import { Home } from "./pages/Home"
import { Results } from "./pages/Results"
import { BlogList } from "./pages/BlogList"
import { BlogPost } from "./pages/BlogPost"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/app" element={<Create />} />
        <Route path="/results" element={<Results />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>
    </Router>
  )
}

export default App
