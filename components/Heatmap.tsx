
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { HabitLog, Language } from '../types';

interface HeatmapProps {
  logs: HabitLog[];
  lang: Language;
}

const Heatmap: React.FC<HeatmapProps> = ({ logs, lang }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Set locale for D3
    if (lang === 'pt') {
        d3.timeFormatDefaultLocale({
            dateTime: "%A, %e de %B de %Y. %X",
            date: "%d/%m/%Y",
            time: "%H:%M:%S",
            periods: ["AM", "PM"],
            days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
            shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
            months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
        });
    } else {
        // Reset to default (English)
        d3.timeFormatDefaultLocale({
            dateTime: "%x, %X",
            date: "%-m/%-d/%Y",
            time: "%-I:%M:%S %p",
            periods: ["AM", "PM"],
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        });
    }

    const width = 800;
    const height = 130;
    const margin = { top: 20, right: 0, bottom: 10, left: 30 };
    const cellSize = 12;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const endDate = new Date();
    const startDate = d3.timeYear.offset(endDate, -1);
    const dateRange = d3.timeDays(startDate, endDate);

    // Group logs by date
    const logCounts = d3.rollup(
      logs,
      v => v.length,
      d => d.date
    );

    const colorScale = d3.scaleThreshold<number, string>()
      .domain([1, 2, 4, 6])
      .range(["#18181b", "#064e3b", "#065f46", "#047857", "#10b981"]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yearData = g.selectAll(".day")
      .data(dateRange)
      .enter().append("rect")
      .attr("class", "day")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => d3.timeWeek.count(startDate, d) * (cellSize + 2))
      .attr("y", d => d.getDay() * (cellSize + 2))
      .attr("rx", 2)
      .attr("fill", d => {
        const dateStr = d3.timeFormat("%Y-%m-%d")(d);
        const count = logCounts.get(dateStr) || 0;
        return colorScale(count);
      })
      .append("title")
      .text(d => `${d3.timeFormat("%b %d, %Y")(d)}: ${logCounts.get(d3.timeFormat("%Y-%m-%d")(d)) || 0} habits`);

    // Add labels
    const days = lang === 'pt' ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    g.selectAll(".day-label")
      .data([1, 3, 5])
      .enter().append("text")
      .attr("x", -5)
      .attr("y", d => d * (cellSize + 2) + 9)
      .attr("text-anchor", "end")
      .attr("class", "text-[10px] fill-zinc-500 font-medium")
      .text(d => days[d]);

    const months = d3.timeMonths(startDate, endDate);
    g.selectAll(".month-label")
      .data(months)
      .enter().append("text")
      .attr("x", d => d3.timeWeek.count(startDate, d) * (cellSize + 2))
      .attr("y", -8)
      .attr("class", "text-[10px] fill-zinc-500 font-medium")
      .text(d => d3.timeFormat("%b")(d));

  }, [logs, lang]); // Re-render when lang changes

  return (
    <div className="w-full overflow-x-auto py-2">
      <svg ref={svgRef} viewBox="0 0 820 150" className="w-full h-auto min-w-[700px]"></svg>
    </div>
  );
};

export default Heatmap;
