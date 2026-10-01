import { useState } from "react";
import HomePage from "./HomePage";
import TwoPointerPage from "./TwoPointer.jsx";
import BinarySearchPage from "./binarySearch.jsx";
import SlidingWindowPage from "./slidingWindow.jsx";
import LinkedListPage from "./linkedList.jsx";
import FastSlowPage from "./fastSlow.jsx";
import "../styles/main.css";
import BTreePage from "./Btree.jsx";
import DictionaryPage from "./dictionary.jsx";
import GraphPage from "./Graph.jsx";


export default function App() {
  const [page, setPage] = useState("home");

  if (page === "two-pointer") return <TwoPointerPage onBack={() => setPage("home")} />;
  if (page === "binary-search") return <BinarySearchPage onBack={() => setPage("home")} />;
  if (page === "sliding-window") return <SlidingWindowPage onBack={() => setPage("home")} />;
  if (page === "linked-list") return <LinkedListPage onBack={() => setPage("home")} />;
  if (page === "fast-slow") return <FastSlowPage onBack={() => setPage("home")} />;
  if (page === "b-tree") return <BTreePage onBack={() => setPage("home")} />;
  if (page === "dictionary") return <DictionaryPage onBack={() => setPage("home")} />;
  if (page === "graph") return <GraphPage onBack={() => setPage("home")} />;
  return <HomePage onNavigate={(id) => setPage(id)} />;
}