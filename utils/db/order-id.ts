export const generateOrderId = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const randomSuffix = Math.floor(Math.random() * 9000 + 1000);
  const OrderNumber = `SU${year}${month}${date}-${randomSuffix}`;
  return OrderNumber;
};
