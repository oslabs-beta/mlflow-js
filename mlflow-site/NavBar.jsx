import { useRef } from "react"


const NavBar = () => {
  const myRef = useRef<HTMLElement | null>(null);
  return (
    <div>
      <div className="projectName">
        MLflow.js
      </div>
      <div className="navBarLinks">
        <button>
          Home
        </button>
        <button>
          Features
        </button>
        <button>
          Demo
        </button>
        <button>
          Team
        </button>
        <img>
          
        </img>
        <img>

        </img>
      </div>
    </div>
  )
}