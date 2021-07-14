import { useState } from 'react';
import SideMenu from "../../components/SideMenu";
import TopBar from "../../components/TopBar";

function CadastroClientePage() {

    const [open, setOpen] = useState(true);

    return (
        <>
            <TopBar open={open} onOpenChange={setOpen} />
            <SideMenu open={open} onOpenChange={setOpen}/>
        </>
    );
}

export default CadastroClientePage