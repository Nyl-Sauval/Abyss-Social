import {Search} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

type SearchType = "users" | "posts";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<SearchType>("users");
  const [search, setSearch] = useState("");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    

    if (searchType === "users") {
      navigate(`/users/search?username=${encodeURIComponent(search)}`);
      return;
    }

    navigate(`/posts/search?query=${encodeURIComponent(search)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
        <Search size={18} className="text-white/70" />
        <select
          value={searchType}
          onChange={(event) => setSearchType(event.target.value as SearchType)}
          className="rounded-full bg-white/10 px-3 py-1 text-sm text-white focus:outline-none"
          aria-label="Type de recherche"
        >
          <option value="users" className="text-abyss-blue">
            Utilisateurs
          </option>
          <option value="posts" className="text-abyss-blue">
            Posts
          </option>
        </select>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={
            searchType === "users"
              ? "Rechercher un utilisateur"
              : "Rechercher un post"
          }
          className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
          aria-label="Recherche"
        />
      </div>
    </form>
  );
};

export default SearchBar;
