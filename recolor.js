const fs = require('fs');
const paths = [
    'src/pages/CommandCenterPage.css',
    'src/pages/DashboardPage.css',
    'src/pages/DriverManagementPage.css',
    'src/pages/LoginPage.css',
    'src/components/AdminLayout.css'
];
const colorMap = {
    '#3b82f6': '#ea580c',
    '#2563eb': '#c2410c',
    '#eff6ff': '#fff7ed',
    '#bfdbfe': '#fed7aa',
    'rgba(59,130,246,': 'rgba(234,88,12,',
    'rgba(59, 130, 246,': 'rgba(234, 88, 12,',
    '#1e293b': '#161616',
    '#0f172a': '#0a0a0a',
    '#050b14': '#000000',
    '#334155': '#262626',
    '#cbd5e1': '#525252',
    '#94a3b8': '#737373',
    '#64748b': '#525252'
};

paths.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        for (const [oldC, newC] of Object.entries(colorMap)) {
            content = content.split(oldC).join(newC);
            content = content.split(oldC.toUpperCase()).join(newC);
        }
        fs.writeFileSync(file, content);
    }
});
