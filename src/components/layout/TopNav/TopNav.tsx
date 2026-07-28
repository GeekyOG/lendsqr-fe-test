import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import chevronRightIcon from "@/assets/icons/chevron-right.svg";
import styles from "./TopNav.module.scss";
import avatar from "@/assets/images/avatar.png"
interface TopNavProps {
  onMenuClick: () => void;
  userName: string;
}

export default function TopNav({ onMenuClick, userName }: TopNavProps) {
  const initial = userName.charAt(0).toUpperCase();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    navigate(trimmed ? `/users?search=${encodeURIComponent(trimmed)}` : "/users");
  }

  return (
    <header className={styles.topNav}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>

      <form className={styles.search} role="search" onSubmit={handleSearchSubmit}>
        <label htmlFor="global-search" className={styles.visuallyHidden}>
          Search for anything
        </label>
        <input
          id="global-search"
          type="search"
          placeholder="Search for anything"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="submit" className={styles.searchButton} aria-label="Search">
          <span className={styles.searchIcon} aria-hidden="true" />
        </button>
      </form>

      <div className={styles.actions}>
        <a href="https://lendsqr.com" className={styles.docsLink} target="_blank" rel="noreferrer">
          Docs
        </a>

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        <div className={styles.profile}>
         <span className={styles.avatar} aria-hidden="true">
            {avatar? <img src={avatar}/>:   initial}
          </span>
         
          <span className={styles.userName}>{userName}</span>
          <img src={chevronRightIcon} alt="" className={styles.profileChevron} />
        </div>
      </div>
    </header>
  );
}
