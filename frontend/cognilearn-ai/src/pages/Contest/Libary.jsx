import Navbar from "../../components/Layouts/Navbar";

const Libary = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* 🔹 Sidebar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          Libary
        </div>
      </main>
    </div>
  );
};

export default Libary;
