import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { ArrowLeft, Cpu, Activity, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const ReportView = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Attempt fetch, fallback to demo
        axios.get(`http://localhost:8080/api/reports/${id}`)
            .then(res => setData(res.data))
            .catch(() => {
                // Demo Data
                setData({
                    race_name: 'Rolex 24 at Daytona (Demo)',
                    ai_report: {
                        pace_analysis: "The race pace was dominated by the #31 Cadillac, which showed consistent 1:35s laps. The initial stint saw heavy degradation for the Porsche #7.",
                        strategy_insight: "The undercut proved powerful around Lap 20. Teams switching to fresh medium compounds gained an average of 2.5 seconds per lap for 3 laps.",
                        key_moments: "Yellow flag at Lap 50 compressed the field."
                    },
                    pit_summary: [
                        { car: "01", pit_stops: 12 },
                        { car: "31", pit_stops: 11 },
                        { car: "10", pit_stops: 13 },
                        { car: "07", pit_stops: 12 },
                        { car: "60", pit_stops: 10 }
                    ],
                    chart_data: [
                        ["Lap", "Car #01", "Car #31"],
                        ["1", 95.2, 95.5],
                        ["5", 94.8, 95.1],
                        ["10", 94.5, 94.9],
                        ["15", 94.9, 94.6],
                        ["20", 96.2, 94.5], // Pit effect
                        ["25", 93.8, 94.0],
                        ["30", 94.1, 94.2]
                    ]
                });
            });
    }, [id]);

    if (!data) return <div style={{padding: '5rem', textAlign: 'center'}}>Loading Deep Analysis...</div>;

    // Charts Config
    const lineOptions = {
        title: 'Lap Time Evolution (Top 2 Contenders)',
        curveType: 'function',
        legend: { position: 'bottom', textStyle: { color: 'white' } },
        backgroundColor: 'transparent',
        titleTextStyle: { color: 'white', fontSize: 18 },
        hAxis: { textStyle: { color: '#aaa' }, title: 'Lap Number', titleTextStyle: { color: '#aaa' } },
        vAxis: { textStyle: { color: '#aaa' }, title: 'Time (s)', titleTextStyle: { color: '#aaa' } },
        colors: ['#00F0FF', '#FF003C']
    };

    const barData = [
        ["Car", "Pit Stops"],
        ...(data.pit_summary ? data.pit_summary.map(p => [p.car, p.pit_stops || p.pit_stop_count]) : [["Demo", 4]])
    ];

    const barOptions = {
        title: 'Pit Stop frequency per Car',
        backgroundColor: 'transparent',
        titleTextStyle: { color: 'white', fontSize: 18 },
        hAxis: { textStyle: { color: '#aaa' } },
        vAxis: { textStyle: { color: '#aaa' } },
        legend: { position: 'none' },
        colors: ['#00F0FF']
    };

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5rem', lineHeight: 1 }}>{data.race_name}</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>AI Powered Strategic Analysis</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Cpu size={24} /> <h3>AI Pace Analysis</h3>
                        </div>
                        <p style={{ lineHeight: 1.6, color: '#ddd' }}>{data.ai_report.pace_analysis}</p>
                    </div>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Activity size={24} /> <h3>Strategy Insight</h3>
                        </div>
                        <p style={{ lineHeight: 1.6, color: '#ddd' }}>{data.ai_report.strategy_insight}</p>
                    </div>
                     <div className="glass-panel" style={{ padding: '1.5rem' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', color: 'var(--primary)' }}>
                            <Timer size={24} /> <h3>Key Moments</h3>
                        </div>
                        <p style={{ lineHeight: 1.6, color: '#ddd' }}>{data.ai_report.key_moments}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Chart
                            chartType="LineChart"
                            width="100%"
                            height="400px"
                            data={data.chart_data || [["x", "y"], [0, 0]]}
                            options={lineOptions}
                        />
                    </div>
                     <div className="glass-panel" style={{ padding: '2rem' }}>
                        <Chart
                            chartType="BarChart"
                            width="100%"
                            height="400px"
                            data={barData}
                            options={barOptions}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportView;
