import ProductTile from "components/ProductTile";
import classes from "./Catalog.module.css";

interface CatalogProps {
  name: string;
  products: any[];
}

function Catalog(props: CatalogProps) {
  const { name, products } = props;

  return (
    <div className={classes.catalog}>
      <div className={classes.catalogHeader}>
        <h2>{name}</h2>
      </div>
      <div className={classes.catalogBody}>
        {products.length > 0 ? (
          products.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))
        ) : (
          <i>Nothing to show</i>
        )}
      </div>
    </div>
  );
}

export default Catalog;
