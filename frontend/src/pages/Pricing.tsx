
import { useMemo, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";

type Strategy = "fixed" | "percentage" | "cost-plus";

export default function Pricing() {
  const [cost, setCost] = useState(1000);
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const [fixedProfit, setFixedProfit] = useState(300);
  const [percentage, setPercentage] = useState(25);
  const [overhead, setOverhead] = useState(100);

  const result = useMemo(() => {
    let price = cost;
    if (strategy === "fixed") price = cost + fixedProfit;
    if (strategy === "percentage") price = cost * (1 + percentage / 100);
    if (strategy === "cost-plus") price = (cost + overhead) * (1 + percentage / 100);
    const profit = price - cost;
    return {
      price: Math.max(0, price),
      profit,
      margin: price > 0 ? (profit / price) * 100 : 0,
    };
  }, [cost, strategy, fixedProfit, percentage, overhead]);

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div><span className="eyebrow">PRICING TOOLS</span><h1>Pricing Calculator</h1><p>Estimate a selling price and understand your profit margin.</p></div>
      </div>

      <div className="pricing-layout">
        <section className="panel">
          <div className="panel-heading"><div><h2>Calculation setup</h2><p>Choose a pricing strategy and enter your costs.</p></div><Calculator /></div>
          <div className="form-stack">
            <label>Product cost (Rs.)<input type="number" min="0" value={cost} onChange={(e) => setCost(Math.max(0, Number(e.target.value)))} /></label>
            <label>Pricing strategy<select value={strategy} onChange={(e) => setStrategy(e.target.value as Strategy)}>
              <option value="fixed">Fixed-profit pricing</option>
              <option value="percentage">Percentage-based markup</option>
              <option value="cost-plus">Cost-based pricing with overhead</option>
            </select></label>

            {strategy === "fixed" && <label>Desired fixed profit (Rs.)<input type="number" min="0" value={fixedProfit} onChange={(e) => setFixedProfit(Math.max(0, Number(e.target.value)))} /></label>}
            {strategy === "percentage" && <label>Profit markup (%)<input type="number" min="0" value={percentage} onChange={(e) => setPercentage(Math.max(0, Number(e.target.value)))} /></label>}
            {strategy === "cost-plus" && <>
              <label>Additional overhead (Rs.)<input type="number" min="0" value={overhead} onChange={(e) => setOverhead(Math.max(0, Number(e.target.value)))} /></label>
              <label>Markup on cost + overhead (%)<input type="number" min="0" value={percentage} onChange={(e) => setPercentage(Math.max(0, Number(e.target.value)))} /></label>
            </>}
          </div>
        </section>

        <section className="pricing-result">
          <div className="result-icon"><TrendingUp size={23} /></div>
          <span>RECOMMENDED SELLING PRICE</span>
          <strong>Rs. {result.price.toLocaleString("en-PK", { maximumFractionDigits: 2 })}</strong>
          <div className="result-divider" />
          <div className="result-line"><span>Product cost</span><b>Rs. {cost.toLocaleString("en-PK")}</b></div>
          {strategy === "cost-plus" && <div className="result-line"><span>Overhead</span><b>Rs. {overhead.toLocaleString("en-PK")}</b></div>}
          <div className="result-line"><span>Estimated profit</span><b>Rs. {result.profit.toLocaleString("en-PK", { maximumFractionDigits: 2 })}</b></div>
          <div className="result-line"><span>Profit margin</span><b>{result.margin.toFixed(1)}%</b></div>
          <p className="result-note">This is an estimate based on the values entered. Actual profit depends on all business costs and the final selling price.</p>
        </section>
      </div>
    </div>
  );
}
