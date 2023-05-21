package com.kenchukky.server.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.kenchukky.server.model.Merchant;

import static com.kenchukky.server.repository.SqlQueries.*;

import java.util.Optional;

@Repository
public class MerchantSqlRepo {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<Merchant> getMerchantData(String merchantId) {
        SqlRowSet rs = jdbcTemplate.queryForRowSet(GET_MERCHANT_DATA, merchantId);

        if (!rs.next()) {
            return Optional.empty();
        }

        Merchant m = Merchant.create(rs);

        return Optional.of(m);
    } 
}
