import { makeStyles } from '@material-ui/core/styles';
import SideMenu from '../components/SideMenu';
import TopBar from '../components/TopBar';
import DashboardCard from '../components/DashboardCard';
import DashboardChart from '../components/DashboardChart';




const useStyles = makeStyles((theme) => ({
    root: {
        boxSizing: 'border-box',
        backgroundColor: theme.palette.background.main,
        height: '100vh',
    },
    card_conteiner: {
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap'
    },
    chart_conteiner: {
        display: 'flex',
        boxSizing: 'border-box',
        width: '1030px',
        height: '550px',
        marginLeft: theme.spacing(2),
        padding: theme.spacing(2),
        borderRadius: '10px',
        backgroundColor: 'white'
    },
}));


function Home() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TopBar/>
            <SideMenu>

                <div className={classes.card_conteiner}>
                    <DashboardCard type='green' />
                    <DashboardCard type='red' />
                    <DashboardCard type='blue' />
                </div>

                <div className={classes.chart_conteiner}>
                    <DashboardChart/>
                </div>

            </SideMenu>

        </div>
    );

}

export default Home;