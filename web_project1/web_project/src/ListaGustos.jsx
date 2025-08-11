
function ListaGustos() {
    const estilos = {
        backgroundColor: "blueviolet",
        
    }
    const gustos = ["si", "fastidiar", "Peliculas", "kelsier"]

    return (
        <>
            <section style={estilos}>
                <h2>Mis gustos</h2>
                <ul>
                    {gustos.map((gustos, index) => 
                    <li key={index}>{gustos}</li>
                    )}
                </ul>
            </section>
        </>
    );
}

export default ListaGustos;