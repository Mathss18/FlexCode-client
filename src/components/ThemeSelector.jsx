import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from 'lodash';
import { getFromLS } from '../utils/storage';
import { useTheme } from "../theme/useTheme";
import { Button } from "@material-ui/core";



const Wrapper = styled.li`
    padding: 48px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #000;
    list-style: none;
`;

const Container = styled.ul`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 3rem;
    padding: 10px;
`;

const Header = styled.h2`
    display: flex;
    justify-content: space-around;
`;

export default function ThemeSelector(props){
    const themesFromStore = getFromLS('all-themes');
    const [data, setData] = useState(themesFromStore.data);
    const [themes, setThemes] = useState([]);
    const {setMode} = useTheme();

    const themeSwitcher = selectedTheme => {
        setMode(selectedTheme);
        props.setter(selectedTheme);
    };

    useEffect(() => {
        setThemes(_.keys(data));
    }, [data]);

    useEffect(() => {
        props.newTheme &&
            updateThemeCard(props.newTheme);
    }, [props.newTheme])

    const updateThemeCard = theme => {
        const key = _.keys(theme)[0];
        const updated = {...data, [key]:theme[key]};
        setData(updated);
    }

    const ThemeCard = props => {
        return(
            <Wrapper style={{backgroundColor: `${data[_.camelCase(props.theme.name)].colors.body}`, 
                    color: `${data[_.camelCase(props.theme.name)].colors.text}`, 
                    fontFamily: `${data[_.camelCase(props.theme.name)].font}`}}>
                    <p>Clique aqui para selecionar este tema</p>
                <Button onClick={ (theme) => themeSwitcher(props.theme) }
                    style={{
                        backgroundColor: `${data[_.camelCase(props.theme.name)].colors.button.primary.background}`, 
                        color: `${data[_.camelCase(props.theme.name)].colors.button.primary.text}`,
                        fontFamily: `${data[_.camelCase(props.theme.name)].font}`}}>
                        {props.theme.name}
                </Button>
            </Wrapper>
        )
    }

    return (
        <div>
            <Header>Selecione um tema.</Header>
            <Container>
            {
                themes.length > 0 && 
                    themes.map(theme =>(
                        <ThemeCard theme={data[theme]} key={data[theme].id} />
                    ))
            }
            </Container>
        </div>
    )
}