// src/components/Leaderboard.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { LeaderboardEntry } from "../types/LeaderboardTypes";
import "./Leaderboard.css";

const Leaderboard: React.FC = () => {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof LeaderboardEntry | "winRate">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    const response = await fetch(
      "https://gateway.pinata.cloud/ipfs/bafkreia2tigtk5kv5x6mptrscob7rwyvooyzte2j7luimkfssvm3m2zf54"
    );
    const json = await response.json();
    const processedData = json.map((entry: LeaderboardEntry) => ({
      ...entry,
      winRate: entry.wins / (entry.wins + entry.losses), // Calculate win rate
    }));
    setData(processedData);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: keyof LeaderboardEntry | "winRate") => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
    const sortedData = [...data].sort((a, b) => {
      const aValue = column === "winRate" ? a.winRate ?? 0 : a[column];
      const bValue = column === "winRate" ? b.winRate ?? 0 : b[column];
      return (aValue > bValue ? 1 : -1) * (isAsc ? 1 : -1);
    });
    setData(sortedData);
  };

  return (
    <div className="leaderboard-component">
      <div className="container my-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Player Name</TableCell>
                <TableCell>Guild</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "score"}
                    direction={sortDirection}
                    onClick={() => handleSort("score")}>
                    Score
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "wins"}
                    direction={sortDirection}
                    onClick={() => handleSort("wins")}>
                    Wins
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "losses"}
                    direction={sortDirection}
                    onClick={() => handleSort("losses")}>
                    Losses
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortColumn === "winRate"}
                    direction={sortDirection}
                    onClick={() => handleSort("winRate")}>
                    Win Rate
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => (
                  <TableRow key={entry.player.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{entry.player.name}</TableCell>
                    <TableCell>{entry.player.guild?.name || "Name missing"}</TableCell>
                    <TableCell>{entry.score}</TableCell>
                    <TableCell>{entry.wins}</TableCell>
                    <TableCell>{entry.losses}</TableCell>
                    <TableCell>
                      {((entry.winRate ?? 0) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 20]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default Leaderboard;
