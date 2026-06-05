import { useState } from "react";
import HomePage from "./HomePage";
import TwoPointerPage from "./TwoPointer.jsx";
import BinarySearchPage from "./binarySearch.jsx";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "two-pointer") {
    return <TwoPointerPage onBack={() => setPage("home")} />;
  }
  else if (page === "binary-search") {
    return <BinarySearchPage onBack={() => setPage("home")} />;
  }
  return <HomePage onNavigate={(id) => setPage(id)} />;
}