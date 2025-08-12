
export default function Cards({titulo, descripcion}){
    return(
        <div>
            <h3>{titulo}</h3>
            <p>{descripcion}</p>
            <button>Ver más</button>
        </div>
    );
}