import { Game, TwitchItem } from "@/types/twitch";

// Relational endpoint constants configured to trigger the Next.js reverse proxy pipeline
const LOGIN_URL = "/login";
const REGISTER_URL = "/register";
const LOGOUT_URL = "/logout";
const GAME_URL = "/game";
const SEARCH_URL = "/search";
const FAVORITE_URL = "/favorite";
const RECOMMENDATION_URL = "/recommendation";

// 1. Secure Authentication: Log In handler processing FormData boundaries
export const login = (credential: Record<string, string>): Promise<void> => {
  const formData = new FormData();
  formData.append("username", credential.username);
  formData.append("password", credential.password);

  return fetch(LOGIN_URL, {
    method: "POST",
    credentials: "include", // Essential: Allows secure session cross-origin cookies to transfer
    body: formData,
  }).then((response) => {
    if (response.status !== 204) {
      throw new Error("Invalid username or password configuration.");
    }
  });
};

// 2. Secure Authentication: User Registration endpoint
export const register = (data: Record<string, string>): Promise<void> => {
  return fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        "Registration failed. Please check inputs and try again.",
      );
    }
  });
};

// 3. Secure Authentication: Active Session Terminate handler
export const logout = (): Promise<void> => {
  return fetch(LOGOUT_URL, {
    method: "POST",
    credentials: "include",
  }).then((response) => {
    if (response.status !== 204) {
      throw new Error("Sign-out routing sequence failed.");
    }
  });
};

// 4. Content Retrieval: Fetch Top Rated Live Game Channels
export const getTopGames = (): Promise<Game[]> => {
  return fetch(GAME_URL).then((response) => {
    if (response.status !== 200) {
      throw new Error("Unable to synchronize popular games taxonomy.");
    }
    return response.json();
  });
};

// 5. Content Retrieval: Internal utility searching game data profiles by raw textual name
const getGameDetails = (gameName: string): Promise<Game[]> => {
  return fetch(`${GAME_URL}?game_name=${encodeURIComponent(gameName)}`).then(
    (response) => {
      if (response.status !== 200) {
        throw new Error("Target gaming platform lookup failed.");
      }
      return response.json();
    },
  );
};

// 6. Content Retrieval: Find media objects by exact Game ID matching parameters
export const searchGameById = (
  gameId: string,
): Promise<Record<string, TwitchItem[]>> => {
  return fetch(`${SEARCH_URL}?game_id=${encodeURIComponent(gameId)}`).then(
    (response) => {
      if (response.status !== 200) {
        throw new Error("Data parsing failed for selected game module feed.");
      }
      return response.json();
    },
  );
};

// 7. Smart Routing Pipeline: Pipeline text names straight into structural numeric resource feeds
export const searchGameByName = (
  gameName: string,
): Promise<Record<string, TwitchItem[]>> => {
  return getGameDetails(gameName).then((data) => {
    if (data && data.length > 0 && data[0].id) {
      return searchGameById(data[0].id);
    }
    throw new Error(
      "No live tracking records exist for inputted category title.",
    );
  });
};

// 8. Personalization Data: Push static items into cloud user collection ledger database
export const addFavoriteItem = (favItem: TwitchItem): Promise<void> => {
  return fetch(FAVORITE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ favorite: favItem }),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        "Failed to synchronize addition to user dashboard cloud logs.",
      );
    }
  });
};

// 9. Personalization Data: Purge target items from user cloud logs container
export const deleteFavoriteItem = (favItem: TwitchItem): Promise<void> => {
  return fetch(FAVORITE_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ favorite: favItem }),
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        "Failed to commit deletion requests back to the master database.",
      );
    }
  });
};

// 10. Personalization Data: Retract comprehensive list collections for verified user profiles
export const getFavoriteItem = (): Promise<Record<string, TwitchItem[]>> => {
  return fetch(FAVORITE_URL, {
    credentials: "include",
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        "Access validation expired. Could not secure saved database rows.",
      );
    }
    return response.json();
  });
};

// 11. Intelligence Feed: Harvest real-time smart streaming recommendations algorithm feeds
export const getRecommendations = (): Promise<Record<string, TwitchItem[]>> => {
  return fetch(RECOMMENDATION_URL, {
    credentials: "include",
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error(
        "Algorithmic matrix update sync dropped. Try hard refreshing.",
      );
    }
    return response.json();
  });
};
