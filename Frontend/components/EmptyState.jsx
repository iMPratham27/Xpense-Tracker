import WalletIcon from "/wallet.svg";
import ChartIcon from "/chart.svg";
import PieIcon from "/pie.svg";

export const EmptyState = ({ message, type }) => {
  const icons = {
    transactions: <img src={WalletIcon} alt="transactions" className="w-12 h-12 opacity-60" />,
    bar: <img src={ChartIcon} alt="bar chart" className="w-12 h-12 opacity-50" />,
    pie: <img src={PieIcon} alt="pie chart" className="w-12 h-12 opacity-60" />,
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-3 py-8 animate-fadeIn">
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
