

function Footer(){
    const year = new Date().getFullYear();

    return(
        <Footer>
            <p>&copy; {year} rodos los derechos reservados </p>
        </Footer>
    );
}

export default Footer;