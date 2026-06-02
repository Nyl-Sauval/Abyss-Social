import {Search} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const UserSearch = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!search) {
      return;
    }

    navigate(`/users/search?username=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
        <Search size={18} className="text-white/70" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un utilisateur"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          aria-label="Rechercher un utilisateur"
        />
      </div>
    </form>
  );
};

export default UserSearch;
