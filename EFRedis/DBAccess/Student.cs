//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DBAccess
{
    using EFCache;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Core.Common;

    public partial class Student
    {
        public string ID { get; set; }
        public string name { get; set; }
        public string @class { get; set; }
    }

    public class Configuration : DbConfiguration

    {

        public Configuration()

        {

            var transactionHandler = new CacheTransactionHandler(new );

            AddInterceptor(transactionHandler);

            var cachingPolicy = new CachingPolicy();

            Loaded +=

              (sender, args) => args.ReplaceService<DbProviderServices>(

                (s, _) => new CachingProviderServices(s, transactionHandler,

                  cachingPolicy));

        }

    }
}
