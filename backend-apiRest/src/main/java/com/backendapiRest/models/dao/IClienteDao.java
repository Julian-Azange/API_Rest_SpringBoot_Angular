package com.backendapiRest.models.dao;

import com.backendapiRest.models.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;


public interface IClienteDao extends JpaRepository<Cliente, Long> {


}
