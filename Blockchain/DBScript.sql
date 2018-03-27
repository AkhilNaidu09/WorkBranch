Create table ProductDetails(Item varchar(20),Name varchar(20),Model varchar(20),Cost varchar(20),SerialNumber varchar(20),UBN varchar(50) primary  key)

Create table ProductInsuranceDetails(UBN varchar(50) PRIMARY KEY,DailyPrice varchar(20),FirstName varchar(20),LastName varchar(20),Email varchar(20),LastDate varchar(20),StartDate varchar(20),ContractTerms varchar(20),_contract varchar(20),theftProtection varchar(5), FOREIGN KEY (UBN) REFERENCES ProductDetails(UBN) )

Create table ProductInsureLoginDetails(UBN varchar(50) PRIMARY KEY,UserName varchar(50),_password varchar(50), FOREIGN KEY (UBN) REFERENCES ProductDetails(UBN))


select * from ProductDetails
select * from ProductInsuranceDetails
select * from ProductInsureLoginDetails


create table Blocks(BlockNumber varchar(20) primary key,UBN varchar(50),BlockHash varchar(255),CreatedDate varchar(50),PreviousBlockHash varchar(255),NextBlock varchar(255))