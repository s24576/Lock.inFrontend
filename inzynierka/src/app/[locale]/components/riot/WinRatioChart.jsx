import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const WinRatioChart = ({ matchesData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const wins = matchesData.filter((match) => match.win === true).length;
    const losses = matchesData.filter((match) => match.win === false).length;
    if (matchesData) {
      // Obliczanie liczby wygranych i przegranych

      const totalGames = wins + losses;
      const winPercentage = totalGames === 0 ? 0 : (wins / totalGames) * 100;
      const lossPercentage = totalGames === 0 ? 0 : (losses / totalGames) * 100;

      // Ustawienia wykresu
      setChartData({
        labels: ["Wins", "Losses"],
        datasets: [
          {
            data: [winPercentage, lossPercentage],
            backgroundColor: ["#f5b800", "#afafaf"], // Kolory dla wygranych i przegranych
            hoverBackgroundColor: ["#c89400", "#8a8a8a"],
            borderColor: "#131313", // Kolor obramowania
            borderWidth: 2, // Grubość obramowania
          },
        ],
      });
    }
  }, [matchesData]);

  if (!chartData) {
    return <div>Loading...</div>; // Jeśli dane nie zostały jeszcze przetworzone
  }

  // Opcje wykresu z wyłączonymi etykietami
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Ukrywa legendę
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`; // Pokazuje procent
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[150px] flex items-center gap-x-6">
      <Pie data={chartData} options={chartOptions} />
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-3">
          <div className="size-8 bg-amber rounded-full"></div>
          <p className="text-[24px] font-chewy text-amber">
            Wins ({matchesData.filter((match) => match.win === true).length})
          </p>
        </div>
        <div className="flex items-center gap-x-3">
          <div className="size-8 bg-silver rounded-full"></div>
          <p className="text-[24px] font-chewy text-silver">
            Losses ({matchesData.filter((match) => match.win === false).length})
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinRatioChart;
