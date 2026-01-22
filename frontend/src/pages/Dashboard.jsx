import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/reports')
            .then(res => {
                setReports(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Backend not connected, using demo data");
                setReports([
                    {
                        id: '1',
                        race_name: 'Rolex 24 at Daytona',
                        created_at: new Date().toISOString(),
                        ai_report: { strategy_insight: 'High tire degradation observed on soft compound.' }
                    },
                    {
                        id: '2',
                        race_name: 'Sebring 12 Hours',
                        created_at: new Date().toISOString(),
                        ai_report: { strategy_insight: 'Undercut powerful in sector 2.' }
                    }
                ]);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="text-gradient" style={{padding: '5rem', textAlign: 'center', fontSize: '2rem'}}>Loading Data...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Race Intelligence Hub</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '3rem', fontSize: '1.2rem' }}>
                    AI-powered strategy analysis and telemetry insights.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {reports.map((report, idx) => (
                        <motion.div
                            key={report.id || idx}
                            whileHover={{ scale: 1.02 }}
                            className="glass-panel"
                            style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{report.race_name}</h3>
                                <span style={{ 
                                    background: 'var(--primary)', 
                                    color: 'black', 
                                    padding: '4px 8px', 
                                    borderRadius: '4px', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold' 
                                }}>ANALYZED</span>
                            </div>
                            
                            <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', gap: '1rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> {new Date(report.created_at).toLocaleDateString()}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {new Date(report.created_at).toLocaleTimeString()}</span>
                            </div>

                            <p style={{ color: '#ddd', lineHeight: '1.6', flex: 1 }}>
                                {report.ai_report?.strategy_insight?.substring(0, 100)}...
                            </p>

                            <Link to={`/report/${report.id || idx}`} style={{ width: '100%' }}>
                                <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                    View Analytics <TrendingUp size={18} />
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
